package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func ReviewRoutes(r *gin.Engine){
	r.GET("/reviews/:id", handlers.GetReviews);

	authorized := r.Group("/");

	authorized.Use(middleware.AuthMiddleware());

	authorized.POST("/reviews", handlers.AddReview);
}