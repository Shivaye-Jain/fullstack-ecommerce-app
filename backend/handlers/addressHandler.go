package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce/config"

	"ecommerce/models"
)

func AddAddress(c *gin.Context) {
	var address models.Address

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return
	}

	userID, _ := c.Get("userID")

	if address.FullName == "" ||
		address.Phone == "" ||
		address.AddressLine == "" ||
		address.City == "" ||
		address.State == "" ||
		address.Pincode == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields are required",
		})

		return
	}

	_, err := config.DB.Exec(`
		INSERT INTO addresses
		(user_id, full_name, phone, address_line, city, state, pincode)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, userID, address.FullName, address.Phone, address.AddressLine, address.City, address.State, address.Pincode)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Address added successfully",
	})
}

func GetAddresses(c *gin.Context) {
	userID, _ := c.Get("userID")

	rows, err := config.DB.Query(`
		SELECT
			id,
			full_name,
			phone,
			address_line,
			city,
			state,
			pincode
		FROM addresses
		WHERE user_id = ?
		ORDER BY created_at DESC
	`, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	defer rows.Close()

	addresses := []models.Address{}

	for rows.Next() {
		var address models.Address

		err := rows.Scan(
			&address.ID,
			&address.FullName,
			&address.Phone,
			&address.AddressLine,
			&address.City,
			&address.State,
			&address.Pincode,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return
		}

		addresses = append(addresses, address)
	}

	c.JSON(http.StatusOK, addresses)

}

func SetDefaultAddress(c *gin.Context) {
	addressID := c.Param("id")

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})

		return
	}

	_, err := config.DB.Exec(`
		UPDATE addresses
		SET is_default = false
		WHERE user_id = ?
	`, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to remove old default address",
		})

		return
	}

	result, err := config.DB.Exec(`
		UPDATE addresses
		SET is_default = true
		WHERE id = ? AND user_id = ?
	`, addressID, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to set default address",
		})
		return
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Address not found",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Default address updated successfully",
	})
}

func UpdateAddress(c *gin.Context) {
	addressID := c.Param("id")

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})

		return
	}

	var body struct {
		FullName    string `json:"full_name"`
		Phone       string `json:"phone"`
		AddressLine string `json:"address_line"`
		City        string `json:"city"`
		State       string `json:"state"`
		Pincode     string `json:"pincode"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})

		return
	}

	_, err := config.DB.Exec(`
		UPDATE addresses
		SET
			full_name = ?,
			phone = ?,
			address_line = ?,
			city = ?,
			state = ?,
			pincode = ?
		WHERE id = ? AND user_id = ?
	`, body.FullName, body.Phone, body.AddressLine, body.City, body.State, body.Pincode, addressID, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update address",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Address updated successfully",
	})
}

func DeleteAddress(c *gin.Context) {
	addressID := c.Param("id")

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})

		return
	}

	var isDefault bool

	err := config.DB.QueryRow(`
		SELECT is_default
		FROM addresses
		WHERE id = ? AND user_id = ?
	`, addressID, userID).Scan(&isDefault)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Address not found",
		})

		return
	}

	_, err = config.DB.Exec(`
		DELETE FROM addresses
		WHERE id = ? AND user_id = ?
	`, addressID, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete address",
		})
		return
	}

	if isDefault {
		// Find another address
		var newDefaultID int

		err = config.DB.QueryRow(`
			SELECT id
			FROM addresses
			WHERE user_id = ?
			LIMIT 1
		`, userID).Scan(&newDefaultID)

		if err == nil {

			// Set another address as default
			_, err = config.DB.Exec(`
				UPDATE addresses
				SET is_default = true
				WHERE id = ?
			`, newDefaultID)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "Failed to update default address",
				})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Address deleted successfully",
	})

}
