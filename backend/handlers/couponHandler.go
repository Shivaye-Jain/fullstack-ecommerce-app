package handlers

import (
	"database/sql"
	"ecommerce/config"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func ApplyCoupon(c *gin.Context){
	var body struct{
		Code string `json:"code"`
		Total float64 `json:"total"`
	}

	if err := c.ShouldBindJSON(&body); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return;
	}

	var discountType string;
	var discountValue float64;
	var minOrderAmount float64;
	var expiresAt time.Time;
	var isActive bool;

	err := config.DB.QueryRow(`
		SELECT
			discount_type,
			discount_value,
			min_order_amount,
			expires_at,
			is_active
		
		FROM coupons
		WHERE code = ?
	`, body.Code).Scan(
		&discountType,
		&discountValue,
		&minOrderAmount,
		&expiresAt,
		&isActive,
	);

	if err != nil{
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid coupon code",
			})

			return;
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	if !isActive{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Coupon is inactive",
		})

		return;
	}

	if time.Now().After(expiresAt){
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Coupon expired",
		})

		return;
	}

	if body.Total < minOrderAmount{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Minimum order amount not reached",
		})

		return;
	}

	var discount float64;

	if discountType == "percentage"{
		discount = body.Total * (discountValue)/100;
	} else {
		discount = discountValue;
	}

	finalTotal := body.Total - discount;

	c.JSON(http.StatusOK, gin.H{
		"discount": discount,
		"finalTotal": finalTotal,
	})
}

