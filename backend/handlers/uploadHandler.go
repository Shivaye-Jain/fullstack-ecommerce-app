package handlers

import (
	"context"
	"net/http"

	"ecommerce/config"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func UploadImage(c *gin.Context) {


	fileHeader, err := c.FormFile("image")

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No image uploaded",
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

	result, err := config.Cloudinary.Upload.Upload(
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
	c.JSON(http.StatusOK, gin.H{
		"url": result.SecureURL,
	})
}