package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func CouponRoutes(r *gin.Engine){
	authorized := r.Group("/");

	authorized.Use(middleware.AuthMiddleware());

	authorized.POST("/apply-coupon", handlers.ApplyCoupon);
}