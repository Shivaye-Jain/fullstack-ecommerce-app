package handlers

import (
	"ecommerce/config"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func AddReview(c *gin.Context) {
	var body struct {
		ProductID int    `json:"product_id"`
		Rating    int    `json:"rating"`
		Comment   string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return;
	}

	userID, _ := c.Get("userID");

	var count int;

	err := config.DB.QueryRow(`
		SELECT COUNT(*)
		FROM orders
		WHERE user_id = ?
		AND payment_status = "paid"
		AND JSON_SEARCH(items, 'one', ?, NULL, '$[*].product_id') IS NOT NULL
	`, userID, strconv.Itoa(body.ProductID)).Scan(&count);

	verifiedPurchase := count > 0;

	var alreadyReviewed int;

	config.DB.QueryRow(`
		SELECT COUNT(*)
		
		FROM reviews

		WHERE user_id = ?
		AND product_id = ?
	`, userID, body.ProductID).Scan(&alreadyReviewed);

	if alreadyReviewed > 0{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "You already reviewed this product",
		})

		return;
	}

	_, err = config.DB.Exec(`
		INSERT INTO reviews
		(user_id, product_id, rating, comment, verified_purchase)
		VALUES (?, ?, ?, ?, ?)
	`, userID, body.ProductID, body.Rating, body.Comment, verifiedPurchase);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Review added successfully",
	})
}

func GetReviews(c *gin.Context){
	productID := c.Param("id");

	rows, err := config.DB.Query(`
		SELECT
			r.id,
			r.rating,
			r.comment,
			r.created_at,
			r.verified_purchase,
			u.name
		
		FROM reviews r
	
		JOIN users u
		ON r.user_id = u.id

		WHERE r.product_id = ?

		ORDER BY r.created_at DESC
	`, productID);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	defer rows.Close();

	reviews := []gin.H{}

	for rows.Next(){
		var id int;
		var rating int;
		var comment string;
		var createdAt time.Time;
		var verifiedPurchase bool
		var userName string;

		err := rows.Scan(
			&id,
			&rating,
			&comment,
			&createdAt,
			&verifiedPurchase,
			&userName,
		)

		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return;
		}

		reviews = append(reviews, gin.H{
			"id": id,
			"rating": rating,
			"comment": comment,
			"created_at": createdAt.Format(time.RFC3339),
			"user_name": userName,
			"verified_purchase":verifiedPurchase,
		})

	}
	c.JSON(http.StatusOK, reviews);
}