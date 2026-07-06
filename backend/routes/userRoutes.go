package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(r *gin.Engine) {

	authorized := r.Group("/")

	authorized.Use(middleware.AuthMiddleware())

	authorized.GET("/me", handlers.GetMe)

	authorized.GET(
		"/profile/stats",
		handlers.GetProfileStats,
	)

	authorized.PUT("/profile", handlers.UpdateProfile);

	authorized.POST("/profile/avatar", handlers.UploadAvatar);
}
