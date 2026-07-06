package utils

import (
	"fmt"

	gomail "gopkg.in/gomail.v2"
)

func SendOrderConfirmationEmail(
	to string,
	orderID int,
	total float64,
) error {
	m := gomail.NewMessage();

	m.SetHeader("From", "jainshivaye25@gmail.com");

	m.SetHeader("To", to);

	m.SetHeader(
		"Subject",
		fmt.Sprintf(
			"Order #%d Confirmed 🎉",
			orderID,
		),
	)

	body := fmt.Sprintf(`
		<h2> Thank you for your order! </h2>

		<p>
			Your order <b>#%d</b> has been placed successfully.
		</p>

		<p>
			Total Amount: <b>₹%.2f</b>
		</p>

		<p>
			We'll notify you once your order ships.
		</p>

		<br/>

		<p>
			Thanks, <br/>
			MyStore Team
		</p>
	`, orderID, total);

	m.SetBody("text/html", body);

	d := gomail.NewDialer(
		"smtp.gmail.com",
		587,
		"jainshivaye25@gmail.com",
		"pzqd ceij nbab yknx",
	);

	return d.DialAndSend(m);
}