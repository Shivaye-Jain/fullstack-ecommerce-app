package routes

import (
	"ecommerce/handlers"

	"github.com/gin-gonic/gin"

	"ecommerce/middleware"
)

func AddressRoutes(r *gin.Engine) {
	authorized := r.Group("/")

	authorized.Use(middleware.AuthMiddleware())

	authorized.POST(
		"/addresses",
		handlers.AddAddress,
	)

	authorized.GET(
		"/addresses",
		handlers.GetAddresses,
	)

	authorized.PUT(
		"/addresses/:id/default",
		handlers.SetDefaultAddress,
	)

	authorized.PUT(
		"/addresses/:id", 
		handlers.UpdateAddress,
	)

	authorized.DELETE(
		"/addresses/:id",
		handlers.DeleteAddress,
	);


}
