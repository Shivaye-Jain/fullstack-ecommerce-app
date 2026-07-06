package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"ecommerce/config"
	"ecommerce/models"
)

func GetProducts(c *gin.Context) {
	// Getting Page and Limit Query Params
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "8")
	search := c.DefaultQuery("search", "")
	category := c.DefaultQuery("category", "All")
	sort := c.DefaultQuery("sort", "")

	orderBy := "id DESC"

	switch sort {
	case "price_asc":
		orderBy = "price ASC"
	case "price_desc":
		orderBy = "price DESC"
	case "rating":
		orderBy = "avg_rating DESC"
	case "newest":
		orderBy = "id DESC"
	}

	// Converting Query Params to String
	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	offset := (page - 1) * limit

	var total int

	countQuery := `
		SELECT COUNT(*) FROM products
		WHERE name LIKE ?
		AND (? = 'All' OR category = ?)
	`

	err := config.DB.QueryRow(
		countQuery,
		"%"+search+"%",
		category,
		category,
	).Scan(&total)

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	query := fmt.Sprintf(`
		SELECT
			p.id,
			p.name,
			p.price,
			p.category,

			IFNULL(ROUND(AVG(r.rating), 1), 0) AS avg_rating,

			p.description,
			p.images,
			p.stock,

			COUNT(r.id) AS review_count
		
		FROM products p

		LEFT JOIN reviews r
		ON p.id = r.product_id

		WHERE p.name LIKE ?
		AND (? = 'All' OR p.category = ?)

		GROUP BY p.id

		ORDER BY %s

		LIMIT ? OFFSET ?
	`, orderBy)

	rows, err := config.DB.Query(query,
		"%"+search+"%",
		category,
		category,
		limit,
		offset,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch products",
		})

		return
	}

	products := []models.Product{}

	for rows.Next() {
		var product models.Product
		var imagesJSON string

		err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Price,
			&product.Category,
			&product.Rating,
			&product.Description,
			&imagesJSON,
			&product.Stock,
			&product.ReviewCount,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to scan product",
			})

			return
		}

		json.Unmarshal([]byte(imagesJSON), &product.Images)

		products = append(products, product)
	}

	c.JSON(http.StatusOK, gin.H{
		"products":   products,
		"total":      total,
		"page":       page,
		"totalPages": totalPages,
	})
}

func GetProductById(c *gin.Context) {
	id := c.Param("id")

	productId, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product id",
		})

		return
	}

	var product models.Product
	var imagesJSON string

	err = config.DB.QueryRow(`
	SELECT
		p.id,
		p.name,
		p.price,
		p.category,

		IFNULL(ROUND(AVG(r.rating), 1), 0) AS avg_rating,

		p.description,
		p.images,

		COUNT(r.id) AS review_count

	FROM products p

	LEFT JOIN reviews r
	ON p.id = r.product_id

	WHERE p.id = ?

	GROUP BY p.id
`, productId).Scan(
		&product.ID,
		&product.Name,
		&product.Price,
		&product.Category,
		&product.Rating,
		&product.Description,
		&imagesJSON,
		&product.ReviewCount,
	)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})

		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database error",
		})

		return
	}

	json.Unmarshal([]byte(imagesJSON), &product.Images)

	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return
	}
	imagesJSON, err := json.Marshal(product.Images)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	result, err := config.DB.Exec(`
		INSERT INTO products
		(name, price, category, rating, description, images, stock)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`,
		product.Name,
		product.Price,
		product.Category,
		product.Rating,
		product.Description,
		string(imagesJSON),
		product.Stock,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	id, _ := result.LastInsertId()

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Product created",
		"productId": id,
	})
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return
	}

	imagesJSON, err := json.Marshal(product.Images)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to process images",
		})

		return
	}

	_, err = config.DB.Exec(`
		UPDATE products
		SET
			name = ?,
			price = ?,
			category = ?,
			rating = ?,
			description = ?,
			images = ?,
			stock = ?
		WHERE id = ?
	`,
		product.Name,
		product.Price,
		product.Category,
		product.Rating,
		product.Description,
		string(imagesJSON),
		product.Stock,
		id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated",
	})
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	_, err := config.DB.Exec(`
		DELETE FROM products
		WHERE id = ?
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete product",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted",
	})
}

func GetCategories(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT DISTINCT category
		FROM products
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	defer rows.Close()

	categories := []string{"All"}

	for rows.Next() {
		var category string
		rows.Scan(&category)

		categories = append(categories, category)
	}

	c.JSON(http.StatusOK, categories)
}

func GetRelatedProducts(c *gin.Context) {
	productID := c.Param("id")

	// STEP 1: GET CURRENT PRODUCT CATEGORY
	var category string

	err := config.DB.QueryRow(`
		SELECT category
		FROM products
		WHERE id = ?
	`, productID).Scan(&category)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	// STEP 2: FETCH RELATED PRODUCTS
	rows, err := config.DB.Query(`
		SELECT id, name, price, category, images
		FROM products
		WHERE category = ?
		AND id != ?
		LIMIT 4
	`, category, productID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch related products",
		})
		return
	}

	defer rows.Close()

	type Product struct {
		ID       int      `json:"id"`
		Name     string   `json:"name"`
		Price    float64  `json:"price"`
		Category string   `json:"category"`
		Images   []string `json:"images"`
	}

	var products []Product

	for rows.Next() {
		var product Product

		var imagesJSON string

		err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Price,
			&product.Category,
			&imagesJSON,
		)

		if err != nil {
			continue
		}

		// convert JSON string to []string
		json.Unmarshal([]byte(imagesJSON), &product.Images)

		products = append(products, product)
	}

	c.JSON(http.StatusOK, products)
}