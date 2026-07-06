package handlers

import (
	"ecommerce/config"
	"ecommerce/models"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddToWishlist(c *gin.Context){
	var item models.WishlistItem;

	if err := c.ShouldBindJSON(&item); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return;
	}

	userID, _ := c.Get("userID");

	var existingID int;

	err := config.DB.QueryRow(`
		SELECT id
		FROM wishlist_items
		WHERE user_id = ?
		AND product_id = ?
	`, userID, item.ProductID).Scan(&existingID);

	if err == nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Already in wishlist",
		})

		return;
	}

	_, err = config.DB.Exec(`
		INSERT INTO wishlist_items
		(user_id, product_id)
		VALUES (?, ?)
	`, userID, item.ProductID);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Added to wishlist",
	})
}

func GetWishlist(c *gin.Context){
	userID, _ := c.Get("userID");

	rows, err := config.DB.Query(`
		SELECT
			products.id,
			products.name,
			products.price,
			products.category,
			products.rating,
			products.description,
			products.images,
			products.stock

		FROM wishlist_items

		JOIN products
		ON wishlist_items.product_id = products.id

		WHERE wishlist_items.user_id = ?
	`, userID,);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	defer rows.Close()

	products := []models.Product{};

	for rows.Next(){
		var product models.Product;
		var images string;

		rows.Scan(
			&product.ID,
			&product.Name,
			&product.Price,
			&product.Category,
			&product.Rating,
			&product.Description,
			&images,
			&product.Stock,
		);

		json.Unmarshal(
			[]byte(images),
			&product.Images,
		)

		products = append(products, product);		
	}

	c.JSON(http.StatusOK, products);
}

func RemoveFromWishlist(c *gin.Context){
	id := c.Param("id");
	userID, _ := c.Get("userID");

	_, err := config.DB.Exec(`
		DELETE FROM wishlist_items
		WHERE user_id = ?
		AND product_id = ?
	`, userID, id);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Removed from wishlist",
	})
}