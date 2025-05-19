package migrations

import (
	"log"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserMigration interface {
	MigrateUser()
	SeedUser()
}

type userMigration struct {
	db *gorm.DB
}

func NewUserMigration() UserMigration {
	return &userMigration{
		db: database.GetDB(),
	}
}

func (c *userMigration) MigrateUser() {
	c.db.Migrator().DropTable(&entities.User{})
	c.db.AutoMigrate(&entities.User{})
}

func (c *userMigration) SeedUser() {
	seeds := []entities.User{
		{
			Id:       uuid.MustParse("33a5345c-daad-40c3-9a1f-9eb7fc5b9325"),
			Name:     "Willy Winata",
			Email:    "willy@gmail.com",
			Password: "Willy@123",
			Role:     "Admin",
		},
	}

	for _, element := range seeds {
		result := c.db.Create(element)

		if result.Error != nil {
			log.Fatalf("Error Seeder: %s", result.Error)
		}
	}
}
