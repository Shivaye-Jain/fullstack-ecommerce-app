package models

type CartItem struct {
	ID        int      `json:"id"`
	ProductID int      `json:"product_id"`
	UserID    int      `json:"user_id"`
	Quantity  int      `json:"quantity"`

	Name        string   `json:"name,omitempty"`
	Price       float64  `json:"price,omitempty"`
	Images      []string `json:"images,omitempty"`
	Stock       int      `json:"stock,omitempty"`
	Description string   `json:"description,omitempty"`
}