package models

type Product struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	Price       float64  `json:"price"`
	Category    string   `json:"category"`
	Rating      float64  `json:"rating"`
	Description string   `json:"description"`
	Images      []string `json:"images"`
	Stock       int      `json:"stock"`
	ReviewCount int      `json:"review_count"`
}
