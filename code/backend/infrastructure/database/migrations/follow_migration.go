package migrations

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
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
	// seeds := []entities.Follow{
	// 	{Id: 1},
	// }

	// for _, element := range seeds {
	// 	result := c.db.Create(element)

	// 	if result.Error != nil {
	// 		log.Fatalf("Error Seeder: %s", result.Error)
	// 	}
	// }
}
