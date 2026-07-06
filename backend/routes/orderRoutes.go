package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(r *gin.Engine){
	authorized := r.Group("/");

	authorized.Use(middleware.AuthMiddleware());

	{
		authorized.POST("/orders", handlers.CreateOrder);

		authorized.GET("/orders", handlers.GetOrders);

		authorized.GET("/orders/:id", handlers.GetOrderByID);
	}
}