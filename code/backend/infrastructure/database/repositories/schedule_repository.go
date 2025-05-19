package repositories

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"gorm.io/gorm"
)

type ScheduleRepository interface {
	CreateNewSchedule(model entities.Schedule) error
	FindSchedule(id int) (entities.Schedule, error)
	GetAllSchedules(userID string) ([]entities.Schedule, error)
	UpdateSchedule(model entities.Schedule) error
	DeleteSchedule(id int) error
}

type scheduleRepository struct {
	db *gorm.DB
}

func NewScheduleRepository() ScheduleRepository {
	return &scheduleRepository{db: database.GetDB()}
}

func (r *scheduleRepository) CreateNewSchedule(model entities.Schedule) error {
	return r.db.Create(&model).Error
}

func (r *scheduleRepository) FindSchedule(id int) (entities.Schedule, error) {
	var entity entities.Schedule

	err := r.db.First(&entity, id).Error
	return entity, err
}

func (r *scheduleRepository) GetAllSchedules(userID string) ([]entities.Schedule, error) {
	var entities []entities.Schedule

	err := r.db.Where("user_id = ?", userID).Find(&entities).Error
	return entities, err
}

func (r *scheduleRepository) UpdateSchedule(model entities.Schedule) error {
	return r.db.Save(&model).Error
}

func (r *scheduleRepository) DeleteSchedule(id int) error {
	return r.db.Delete(&entities.Schedule{}, id).Error
}
