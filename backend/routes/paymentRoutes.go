package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func PaymentRoutes(r *gin.Engine){
	authorized := r.Group("/");

	authorized.Use(middleware.AuthMiddleware());

	{
		authorized.POST("/create-order", handlers.CreateRazorpayOrder);
		authorized.POST("/verify-payment", handlers.VerifyPayment);
	}
}