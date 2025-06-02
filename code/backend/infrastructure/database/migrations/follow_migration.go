package migrations

import (
	"log"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FollowMigration interface {
	MigrateFollow()
	SeedFollow()
}

type followMigration struct {
	db *gorm.DB
}

func NewFollowMigration() FollowMigration {
	return &followMigration{
		db: database.GetDB(),
	}
}

func (c *followMigration) MigrateFollow() {
	c.db.Migrator().DropTable(&entities.Follow{})
	c.db.AutoMigrate(&entities.Follow{})
}

func (c *followMigration) SeedFollow() {
	seeds := []entities.Follow{
		{
			Id:          uuid.New(),
			UserId:      uuid.Nil,
			FollowingId: uuid.Nil,
		},
	}

	for _, element := range seeds {
		result := c.db.Create(element)

		if result.Error != nil {
			log.Fatalf("Error Seeder: %s", result.Error)
		}
	}
}
