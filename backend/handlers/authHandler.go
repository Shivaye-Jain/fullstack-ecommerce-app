package handlers

import (
	"net/http"

	"ecommerce/config"
	"ecommerce/models"
	"ecommerce/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Input",
		})

		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	_, err = config.DB.Exec(`
		INSERT INTO USERS(name, email, password, phone)
		VALUES (?, ?, ?, ?)
	`,
		user.Name,
		user.Email,
		string(hashedPassword),
		user.Phone,
	)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "User already exists",
		})

		return;
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
	})
}

func Login(c *gin.Context){
	var user models.User;

	if err := c.ShouldBindJSON(&user); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return
	}

	var dbUser models.User

	err := config.DB.QueryRow(`
		SELECT id, name, email, password, role
		FROM users
		WHERE email = ?
	`, user.Email).Scan(
		&dbUser.ID,
		&dbUser.Name,
		&dbUser.Email,
		&dbUser.Password,
		&dbUser.Role,
	)

	if (err != nil){
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})

		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(dbUser.Password),
		[]byte(user.Password),
	)

	if (err != nil){
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})

		return;
	}

	token, err := utils.GenerateToken(dbUser.ID, dbUser.Email, dbUser.Role);

	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})

		return;
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token": token,
		"user": gin.H{
			"id": dbUser.ID,
			"name": dbUser.Name,
			"email": dbUser.Email,
			"role": dbUser.Role,
		},
	})
}