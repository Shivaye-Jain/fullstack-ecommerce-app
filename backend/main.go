package main

import (
	"ecommerce/config"
	"ecommerce/routes"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	_ = godotenv.Load()

	config.ConnectDB()

	config.InitCloudinary()

	r := gin.Default()

	// ✅ CORS middleware HERE
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"https://fullstack-ecommerce-app-two.vercel.app",
		},

		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},

		ExposeHeaders: []string{
			"Content-Length",
		},

		AllowCredentials: true,
	}))

	r.Static("/uploads", "./uploads")

	routes.AuthRoutes(r)

	routes.ProductRoutes(r)

	routes.OrderRoutes(r)

	routes.AdminRoutes(r)

	routes.CartRoutes(r)

	routes.PaymentRoutes(r)

	routes.WishlistRoutes(r)

	routes.AddressRoutes(r)

	routes.CouponRoutes(r)

	routes.ReviewRoutes(r)

	routes.UserRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
