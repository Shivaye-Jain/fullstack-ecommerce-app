package handlers

import (
	"ecommerce/config"
	"ecommerce/models"
	"ecommerce/utils"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {

	var order models.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return
	}

	itemsJSON, err := json.Marshal(order.Items)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	// ✅ CHECK & UPDATE STOCK

	for _, item := range order.Items {

		var currentStock int

		err := config.DB.QueryRow(
			"SELECT stock FROM products WHERE id = ?",
			item.ProductID,
		).Scan(&currentStock)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return
		}

		if currentStock < item.Quantity {

			c.JSON(http.StatusBadRequest, gin.H{
				"error": item.Name + " is out of stock",
			})

			return
		}

		newStock := currentStock - item.Quantity

		_, err = config.DB.Exec(
			"UPDATE products SET stock = ? WHERE id = ?",
			newStock,
			item.ProductID,
		)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update stock",
			})

			return
		}
	}

	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})
		return
	}

	userID := int(userIDValue.(float64))

	// ✅ INSERT ORDER

	var userEmail string

	err = config.DB.QueryRow(
		"SELECT email FROM users WHERE id = ?",
		userID,
	).Scan(&userEmail)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch user email",
		})

		return
	}

	result, err := config.DB.Exec(`
		INSERT INTO orders (
			items,
			total,
			user_id,
			status,
			payment_status,
			payment_id,
			address_id,
			coupon_code,
			discount,
			final_total
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		string(itemsJSON),
		order.Total,
		userID,
		"confirmed",
		"paid",
		order.PaymentID,
		order.AddressID,
		order.CouponCode,
		order.Discount,
		order.FinalTotal,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}
	id, _ := result.LastInsertId()

	_, err = config.DB.Exec(`
	INSERT INTO order_status_history (
		order_id,
		status
	)
	VALUES (?, ?)
`, id, "pending")

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create order timeline",
		})

		return
	}

	// ✅ SEND EMAIL ASYNC
	go utils.SendOrderConfirmationEmail(
		userEmail,
		int(id),
		order.FinalTotal,
	)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created",
		"orderId": id,
	})
}

func GetOrders(c *gin.Context) {
	userID, _ := c.Get("userID")

	rows, err := config.DB.Query(`
		SELECT
			o.id,
			o.items,
			o.total,
			o.created_at,
			o.status,

			a.full_name,
			a.phone,
			a.address_line,
			a.city,
			a.state,
			a.pincode

		FROM orders o

		LEFT JOIN addresses a
		ON o.address_id = a.id

		WHERE o.user_id = ?
		ORDER BY o.created_at DESC
	`, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	orders := []gin.H{}

	for rows.Next() {
		var id int
		var items string
		var total float64
		var createdAt time.Time
		var status string

		var fullName string
		var phone string
		var addressLine string
		var city string
		var state string
		var pincode string

		err := rows.Scan(
			&id,
			&items,
			&total,
			&createdAt,
			&status,

			&fullName,
			&phone,
			&addressLine,
			&city,
			&state,
			&pincode,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return
		}

		var parsedItems interface{}

		json.Unmarshal(
			[]byte(items),
			&parsedItems,
		)

		orders = append(orders, gin.H{
			"id":         id,
			"items":      parsedItems,
			"total":      total,
			"created_at": createdAt,
			"status":     status,

			"full_name":    fullName,
			"phone":        phone,
			"address_line": addressLine,
			"city":         city,
			"state":        state,
			"pincode":      pincode,
		})
	}

	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT
			orders.id,
			orders.items,
			orders.total,
			orders.status,
			orders.created_at,
			users.email
		
		FROM orders

		JOIN users

		ON orders.user_id = users.id

		ORDER BY orders.created_at DESC
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	orders := []gin.H{}

	for rows.Next() {
		var id int
		var items string
		var total float64
		var status string
		var createdAt string
		var email string

		rows.Scan(
			&id,
			&items,
			&total,
			&status,
			&createdAt,
			&email,
		)

		var parsedItems interface{}

		json.Unmarshal([]byte(items), &parsedItems)

		orders = append(orders, gin.H{
			"id":         id,
			"items":      parsedItems,
			"total":      total,
			"status":     status,
			"created_at": createdAt,
			"email":      email,
		})
	}

	c.JSON(http.StatusOK, orders)
}

func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return
	}

	_, err := config.DB.Exec(`
		UPDATE orders
		SET status = ?
		WHERE id = ?
	`, body.Status, id)

	_, err = config.DB.Exec(`
	INSERT INTO order_status_history (
		order_id,
		status
	)
	VALUES (?, ?)
`, id, body.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order status updated",
	})
}

func GetOrderByID(c *gin.Context) {
	orderID := c.Param("id")

	userID, _ := c.Get("userID")

	var (
		id            int
		itemsJSON     string
		total         float64
		createdAt     string
		status        string
		paymentStatus string
		paymentID     string
		addressID     int
		couponCode    string
		discount      float64
		finalTotal    float64
	)

	err := config.DB.QueryRow(`
		SELECT
			id,
			items,
			total,
			created_at,
			status,
			payment_status,
			payment_id,
			address_id,
			coupon_code,
			discount,
			final_total
		
		FROM orders

		WHERE id = ?
		AND user_id = ?
	`, orderID, userID).Scan(
		&id,
		&itemsJSON,
		&total,
		&createdAt,
		&status,
		&paymentStatus,
		&paymentID,
		&addressID,
		&couponCode,
		&discount,
		&finalTotal,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Order not found",
		})

		return
	}

	var items []models.OrderItem

	json.Unmarshal(
		[]byte(itemsJSON),
		&items,
	)
	type Address struct {
		FullName    string `json:"full_name"`
		Phone       string `json:"phone"`
		AddressLine string `json:"address_line"`
		City        string `json:"city"`
		State       string `json:"state"`
		Pincode     string `json:"pincode"`
	}

	var address Address

	err = config.DB.QueryRow(`
	SELECT
		full_name,
		phone,
		address_line,
		city,
		state,
		pincode

	FROM addresses

	WHERE id = ?
`, addressID).Scan(
		&address.FullName,
		&address.Phone,
		&address.AddressLine,
		&address.City,
		&address.State,
		&address.Pincode,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch address",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             id,
		"items":          items,
		"total":          total,
		"created_at":     createdAt,
		"status":         status,
		"payment_status": paymentStatus,
		"payment_id":     paymentID,
		"coupon_code":    couponCode,
		"discount":       discount,
		"final_total":    finalTotal,
		"address":        address,
	})
}
