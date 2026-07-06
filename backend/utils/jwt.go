package utils;

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
);

var JwtSecret = []byte("supersecretkey");

func GenerateToken(userID int, email string, role string) (string, error){
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,

		jwt.MapClaims{
			"userId": userID,
			"email": email,
			"role": role,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		},
	)

	return token.SignedString(JwtSecret);
}