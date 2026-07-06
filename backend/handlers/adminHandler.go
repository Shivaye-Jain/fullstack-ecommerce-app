package handlers

import (
	"encoding/json"
	"net/http"
	"sort"

	"ecommerce/config"
	"ecommerce/models"

	"github.com/gin-gonic/gin"
)

func GetDashboardStats(c *gin.Context) {
	var totalUsers int
	var totalProducts int
	var totalOrders int
	var totalRevenue float64

	config.DB.QueryRow(`
		SELECT COUNT(*) FROM users
	`).Scan(&totalUsers)

	config.DB.QueryRow(`
		SELECT COUNT(*) FROM products
	`).Scan(&totalProducts)

	config.DB.QueryRow(`
		SELECT COUNT(*) FROM orders
	`).Scan(&totalOrders)

	config.DB.QueryRow(`
		SELECT IFNULL(SUM(total), 0)
		FROM orders
	`).Scan(&totalRevenue)

	c.JSON(http.StatusOK, gin.H{
		"totalUsers":    totalUsers,
		"totalProducts": totalProducts,
		"totalOrders":   totalOrders,
		"totalRevenue":  totalRevenue,
	})
}

func GetSalesAnalytics(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT
			DATE(created_at) as date,
			SUM(total) as revenue,
			COUNT(*) as orders
		FROM orders
		GROUP BY DATE(created_at)
		ORDER BY date ASC
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	var analytics []gin.H

	for rows.Next() {
		var date string
		var revenue float64
		var orders int

		rows.Scan(
			&date,
			&revenue,
			&orders,
		)

		analytics = append(analytics, gin.H{
			"date":    date,
			"revenue": revenue,
			"orders":  orders,
		})
	}

	c.JSON(http.StatusOK, analytics)
}

func GetRecentOrders(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT id, total, created_at
		FROM orders
		ORDER BY created_at DESC
		LIMIT 5
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	var orders []gin.H

	for rows.Next() {

		var id int
		var total float64
		var createdAt string

		rows.Scan(
			&id,
			&total,
			&createdAt,
		)

		orders = append(orders, gin.H{
			"id":         id,
			"total":      total,
			"created_at": createdAt,
		})
	}

	c.JSON(http.StatusOK, orders)
}

func GetTopProducts(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT items
		FROM orders
		WHERE payment_status = "paid"
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	type ProductAnalytics struct {
		ID        int     `json:"id"`
		Name      string  `json:"name"`
		Image     string  `json:"image"`
		TotalSold int     `json:"totalSold"`
		Revenue   float64 `json:"revenue"`
	}

	productMap := make(map[int]*ProductAnalytics)

	for rows.Next() {
		var itemsJSON string

		rows.Scan(&itemsJSON)

		var items []models.OrderItem

		json.Unmarshal([]byte(itemsJSON), &items)

		for _, item := range items {
			if _, exists := productMap[item.ProductID]; !exists {
				productMap[item.ProductID] = &ProductAnalytics{
					ID:        item.ProductID,
					Name:      item.Name,
					Image:     item.Images[0],
					TotalSold: 0,
					Revenue:   0,
				}

			}
			productMap[item.ProductID].TotalSold += item.Quantity
			productMap[item.ProductID].Revenue +=
				float64(item.Quantity) * item.Price
		}
	}

	var result []ProductAnalytics

	for _, product := range productMap {
		result = append(result, *product)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].TotalSold > result[j].TotalSold
	})

	if len(result) > 5 {
		result = result[:5]
	}

	c.JSON(http.StatusOK, result)
}

func GetRevenueByCategory(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT items
		FROM orders
		WHERE payment_status = 'paid'
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	categoryRevenue := make(map[string]float64)

	for rows.Next() {
		var itemsJSON string

		rows.Scan(&itemsJSON)

		var items []models.OrderItem

		json.Unmarshal([]byte(itemsJSON), &items)

		for _, item := range items {

			revenue :=
				float64(item.Quantity) * item.Price

			var category string

			err := config.DB.QueryRow(
				"SELECT category FROM products WHERE id = ?",
				item.ProductID,
			).Scan(&category)

			if err != nil {
				continue
			}

			categoryRevenue[category] += revenue
		}
	}

	type CategoryRevenue struct {
		Category string  `json:"category"`
		Revenue  float64 `json:"revenue"`
	}

	var result []CategoryRevenue

	for category, revenue := range categoryRevenue {
		result = append(result, CategoryRevenue{
			Category: category,
			Revenue:  revenue,
		})
	}

	c.JSON(http.StatusOK, result)
}
