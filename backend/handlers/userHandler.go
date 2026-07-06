package handlers

import (
	"context"
	"database/sql"
	"ecommerce/config"
	"ecommerce/models"
	"net/http"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func GetMe(c *gin.Context) {

	userIDValue, _ := c.Get("userID")

	userID := int(userIDValue.(float64))

	var user models.User

	var avatar sql.NullString

	err := config.DB.QueryRow(`
		SELECT
			id,
			name,
			email,
			role,
			phone,
			avatar,
			created_at
		FROM users
		WHERE id = ?
	`, userID).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.Phone,
		&avatar,
		&user.CreatedAt,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	if avatar.Valid {
		user.Avatar = avatar.String
	}

	c.JSON(http.StatusOK, user)
}

func GetProfileStats(c *gin.Context) {
	userIDValue, _ := c.Get("userID")

	userID := int(userIDValue.(float64))

	var totalOrders int
	var wishlistItems int
	var totalAddresses int

	config.DB.QueryRow(
		"SELECT COUNT(*) FROM orders WHERE user_id = ?",
		userID,
	).Scan(&totalOrders)

	config.DB.QueryRow(
		"SELECT COUNT(*) FROM wishlist WHERE user_id = ?",
		userID,
	).Scan(&wishlistItems)

	// SAVED ADDRESSES
	config.DB.QueryRow(
		"SELECT COUNT(*) FROM addresses WHERE user_id = ?",
		userID,
	).Scan(&totalAddresses)

	c.JSON(http.StatusOK, gin.H{
		"totalOrders":    totalOrders,
		"wishlistItems":  wishlistItems,
		"totalAddresses": totalAddresses,
	})

}

func UpdateProfile(c *gin.Context) {
	userIDValue, _ := c.Get("userID")

	userID := int(userIDValue.(float64))

	var body struct {
		Name  string `json:"name"`
		Phone string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return
	}

	_, err := config.DB.Exec(`
		UPDATE users
		SET
			name = ?,
			phone = ?
		WHERE id = ?
	`,
		body.Name,
		body.Phone,
		userID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update profile",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
	})
}

func UploadAvatar(c *gin.Context) {

	userIDValue, exists := c.Get("userID")

	if !exists {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	userID := int(userIDValue.(float64))

	// GET FILE

	fileHeader, err := c.FormFile("avatar")

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No avatar uploaded",
		})

		return
	}

	file, err := fileHeader.Open()

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to open file",
		})

		return
	}

	defer file.Close()

	// UPLOAD TO CLOUDINARY

	result, err :=
		config.Cloudinary.Upload.Upload(
			context.Background(),
			file,
			uploader.UploadParams{},
		)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	avatarURL := result.SecureURL

	// SAVE IN DATABASE

	_, err = config.DB.Exec(`
		UPDATE users
		SET avatar = ?
		WHERE id = ?
	`,
		avatarURL,
		userID,
	)

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update avatar",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"avatar": avatarURL,
	})
}