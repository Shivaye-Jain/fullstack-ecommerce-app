package routes

import (
	"ecommerce/middleware"

	"ecommerce/handlers"

	"github.com/gin-gonic/gin"
)

func CartRoutes(r *gin.Engine){
	authorized := r.Group("/");

	
	authorized.Use(middleware.AuthMiddleware());

	authorized.POST("/cart", handlers.AddToCart)
	authorized.GET("/cart", handlers.GetCart)
	authorized.PUT("/cart/:id", handlers.UpdateCartQuantity)
	authorized.DELETE("/cart/:id", handlers.RemoveFromCart);
	authorized.DELETE("/cart/clear", handlers.ClearCart);
}