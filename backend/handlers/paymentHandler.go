package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/razorpay/razorpay-go"
)

func CreateRazorpayOrder(c *gin.Context){
	var body struct{
		Amount float64 `json:"amount"`
	}

	if err := c.ShouldBindJSON(&body); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return;
	}

	client := razorpay.NewClient(
		os.Getenv("RAZORPAY_KEY"),
		os.Getenv("RAZORPAY_SECRET"),
	)

	data := map[string]interface{}{
		"amount": body.Amount * 100,
		"currency": "INR",
		"receipt": "receipt_1",
	}

	order, err := client.Order.Create(data, nil);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, order);
}

func VerifyPayment(c *gin.Context){
	var body struct{
		RazorpayOrderID string `json:"razorpay_order_id"`
		RazorpayPaymentID string `json:"razorpay_payment_id"`
		RazorpaySignature string `json:"razorpay_signature"`
	}

	if err := c.ShouldBindJSON(&body); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return;
	}

	secret := os.Getenv("RAZORPAY_SECRET");

	data := body.RazorpayOrderID + "|" + body.RazorpayPaymentID;

	h := hmac.New(
		sha256.New,
		[]byte(secret),
	)

	h.Write([]byte(data));

	expectedSignature := hex.EncodeToString(
		h.Sum(nil),
	)

	if expectedSignature != body.RazorpaySignature{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid payment signature",
		})
		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment verified successfully",
	})
}