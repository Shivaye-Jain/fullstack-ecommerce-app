package models

type OrderItem struct {
	ID        int      `json:"id"`
	ProductID int      `json:"product_id"`
	Name      string   `json:"name"`
	Price     float64  `json:"price"`
	Quantity  int      `json:"quantity"`
	Images    []string `json:"images"`
}
type Order struct {
	ID        int         `json:"id"`
	Items     []OrderItem `json:"items"`
	Total     float64     `json:"total"`
	CreatedAt string      `json:"created_at"`
	AddressID int         `json:"address_id"`

	PaymentID  string  `json:"payment_id"`
	CouponCode string  `json:"coupon_code"`
	Discount   float64 `json:"discount"`
	FinalTotal float64 `json:"final_total"`
}
