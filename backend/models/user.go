package models

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
	CreatedAt string `json:"created_at"`
	Phone string `json:"phone"`
	Avatar string `json:"avatar"`
}
