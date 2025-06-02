package database

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
	once sync.Once
	err error
)

func init() {
	err = godotenv.Load("config/.env")
	if err != nil {
		log.Println("Config not found")
	}
}

func GetDB() *gorm.DB {
	once.Do(func() {
		dsn := os.Getenv("DB_URL")
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			panic("failed to connect to database: " + err.Error())
		}
	})

	return db
}