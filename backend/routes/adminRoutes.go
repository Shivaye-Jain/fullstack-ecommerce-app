package routes

import (
	"ecommerce/handlers"
	"ecommerce/middleware"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.Engine) {
	admin := r.Group("/admin")
	admin.Use(
		middleware.AuthMiddleware(),
		middleware.AdminMiddleware(),
	)

	{
		admin.GET("/dashboard", handlers.GetDashboardStats)

		admin.POST("/products", handlers.CreateProduct)

		admin.PUT("/products/:id", handlers.UpdateProduct)

		admin.DELETE("/products/:id", handlers.DeleteProduct)

		admin.GET("/analytics", handlers.GetSalesAnalytics)

		admin.GET("/recent-orders", handlers.GetRecentOrders)

		admin.POST("/upload", handlers.UploadImage)

		admin.GET("/orders", handlers.GetAllOrders)

		admin.PUT("/orders/:id", handlers.UpdateOrderStatus);

		admin.GET("/top-products", handlers.GetTopProducts);

		admin.GET("/revenue-by-category", handlers.GetRevenueByCategory);

		
	}
}
