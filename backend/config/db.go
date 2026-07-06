package config;

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
);

var DB *sql.DB;

func ConnectDB(){
	dsn := "root:shiva1jain@tcp(127.0.0.1:3306)/ecommerce?parseTime=true";

	db, err := sql.Open("mysql", dsn);

	if (err != nil){
		panic(err);
	}

	err = db.Ping();

	if (err != nil){
		panic(err);
	}

	DB = db;
}