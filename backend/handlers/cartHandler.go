package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"ecommerce/config"
	"ecommerce/models"

	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context){
	var item models.CartItem;

	if err := c.ShouldBindJSON(&item); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return;
	}

	var stock int

	err := config.DB.QueryRow(`
		SELECT stock FROM products
		WHERE id = ?
	`, item.ProductID).Scan(&stock);

	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	userID, _ := c.Get("userID");
	
	var existingID int;
	var existingQuantity int;

	err = config.DB.QueryRow(`
		SELECT id, quantity
		FROM cart_items
		WHERE user_id = ?
		AND product_id = ?
	`, userID, item.ProductID).Scan(&existingID, &existingQuantity);

	if (err != nil){
		if (err == sql.ErrNoRows){

			if item.Quantity > stock{
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Stock limit reached",
				})

				return;
			}

			_, err := config.DB.Exec(`
				INSERT INTO cart_items
				(user_id, product_id, quantity)
				VALUES (?, ?, ?)
			`, userID, item.ProductID, item.Quantity);

			if err != nil{
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err.Error(),
				})

				return;
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return;
		}
	} else {
		newQuantity := existingQuantity + item.Quantity;

		if (newQuantity > stock){
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Stock limit reached",	
			})

			return;
		}

		_, err := config.DB.Exec(`
			UPDATE cart_items
			SET quantity = ?
			WHERE id = ?
		`, newQuantity, existingID);

		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return;
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart Updated",
	})
}

func GetCart(c *gin.Context){
	userID, _ := c.Get("userID");

	rows, err := config.DB.Query(`
		SELECT
			cart_items.id,
			cart_items.product_id,
			cart_items.quantity,

			products.name,
			products.price,
			products.images,
			products.stock,
			products.description
		
		FROM cart_items

		JOIN products
		ON cart_items.product_id = products.id

		WHERE cart_items.user_id = ?
	`, userID);

	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	defer rows.Close()

	cartItems := []models.CartItem{}

	for rows.Next(){
		var item models.CartItem

		var imagesJSON string

		err := rows.Scan(
			&item.ID,
			&item.ProductID,
			&item.Quantity,

			&item.Name,
			&item.Price,
			&imagesJSON,
			&item.Stock,
			&item.Description,
		)

		if (err != nil){
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return;
		}

		json.Unmarshal(
			[]byte(imagesJSON),
			&item.Images,
		)
		cartItems = append(cartItems, item);
	}

	c.JSON(http.StatusOK, cartItems);
}

func UpdateCartQuantity(c *gin.Context){
	id := c.Param("id");

	var body struct{
		Quantity int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&body); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid input",
		})

		return;
	}

	if (body.Quantity <= 0){
		_, err := config.DB.Exec(`
			DELETE FROM cart_items
			WHERE id = ?
		`, id);

		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Item removed",
		})

		return
	}

	var productID int;

	err := config.DB.QueryRow(`
		SELECT product_id
		FROM cart_items
		WHERE id = ?
	`, id).Scan(&productID);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	var stock int;

	err = config.DB.QueryRow(`
		SELECT stock
		FROM products
		WHERE id = ?
	`, productID).Scan(&stock);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	if body.Quantity > stock{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Stock limit reached",
		})
		return;
	}


	_, err = config.DB.Exec(`
		UPDATE cart_items 
		SET quantity = ?
		WHERE id = ?
	`, body.Quantity, id);

	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Quantity updated",
	})
}

func RemoveFromCart(c *gin.Context){
	id := c.Param("id");

	_, err := config.DB.Exec(`
		DELETE FROM cart_items
		WHERE id = ?
	`, id);

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item removed",
	})
}

func ClearCart (c *gin.Context){
	userID, _ := c.Get("userID");

	_, err := config.DB.Exec(`
		DELETE FROM cart_items
		WHERE user_id = ?
	`, userID);

	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart cleared",
	})
}