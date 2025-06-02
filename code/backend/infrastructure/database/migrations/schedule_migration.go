package migrations

import (
	"log"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ScheduleMigration interface {
	MigrateSchedule()
	SeedSchedule()
}

type scheduleMigration struct {
	db *gorm.DB
}

func NewScheduleMigration() ScheduleMigration {
	return &scheduleMigration{
		db: database.GetDB(),
	}
}

func (c *scheduleMigration) MigrateSchedule() {
	c.db.Migrator().DropTable(&entities.Schedule{}, &entities.ScheduleParticipant{})
	c.db.AutoMigrate(&entities.Schedule{}, &entities.ScheduleParticipant{})
}

func (c *scheduleMigration) SeedSchedule() {
	seeds := []entities.Schedule{
		{Id: uuid.New()},
	}

	for _, element := range seeds {
		result := c.db.Create(element)

		if result.Error != nil {
			log.Fatalf("Error Seeder: %s", result.Error)
		}
	}
}
