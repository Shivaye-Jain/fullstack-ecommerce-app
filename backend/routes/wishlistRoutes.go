package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func WishlistRoutes(r *gin.Engine) {
	authorized := r.Group("/")

	authorized.Use(middleware.AuthMiddleware())

	authorized.POST("/wishlist", handlers.AddToWishlist);

	authorized.GET("/wishlist", handlers.GetWishlist);

	authorized.DELETE("/wishlist/:id", handlers.RemoveFromWishlist);
}