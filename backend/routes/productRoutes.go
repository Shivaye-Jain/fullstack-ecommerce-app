package routes

import (
	"github.com/gin-gonic/gin"

	"ecommerce/handlers"
)

func ProductRoutes(r *gin.Engine) {
	r.GET("/products", handlers.GetProducts)

	r.GET("/products/:id", handlers.GetProductById)

	
	r.GET("/categories", handlers.GetCategories)

	r.GET("/products/:id/related", handlers.GetRelatedProducts);
}
