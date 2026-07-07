package config

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("MYSQLUSER"),
		os.Getenv("MYSQLPASSWORD"),
		os.Getenv("MYSQLHOST"),
		os.Getenv("MYSQLPORT"),
		os.Getenv("MYSQLDATABASE"),
	)

	db, err := sql.Open("mysql", dsn)

	if err != nil {
		panic(err)
	}

	err = db.Ping()

	if err != nil {
		panic(err)
	}

	DB = db
}