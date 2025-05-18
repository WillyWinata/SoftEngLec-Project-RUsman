package services

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database/repositories"
)

type ScheduleService interface {
	CreateNewSchedule(Schedule entities.Schedule) error
	GetScheduleByID(id int) (entities.Schedule, error)
	GetAllSchedules(userID string) ([]entities.Schedule, error)
	UpdateSchedule(Schedule entities.Schedule) error
	DeleteSchedule(id int) error
}

type scheduleService struct {
	repo repositories.ScheduleRepository
}

func NewScheduleService() ScheduleService {
	return &scheduleService{
		repo: repositories.NewScheduleRepository(),
	}
}

func (s *scheduleService) CreateNewSchedule(Schedule entities.Schedule) error {
	err := s.repo.CreateNewSchedule(Schedule)
	if err != nil {
		return err
	}

	return nil
}

func (s *scheduleService) GetScheduleByID(id int) (entities.Schedule, error) {
	schedule, err := s.repo.FindSchedule(id)
	if err != nil {
		return entities.Schedule{}, err
	}

	return schedule, nil
}

func (s *scheduleService) GetAllSchedules(userID string) ([]entities.Schedule, error) {
	schedules, err := s.repo.GetAllSchedules(userID)
	if err != nil {
		return nil, err
	}

	return schedules, nil
}

func (s *scheduleService) UpdateSchedule(Schedule entities.Schedule) error {
	err := s.repo.UpdateSchedule(Schedule)
	if err != nil {
		return err
	}

	return nil
}

func (s *scheduleService) DeleteSchedule(id int) error {
	err := s.repo.DeleteSchedule(id)
	if err != nil {
		return err
	}

	return nil
}

func ValidateSchedule(Schedule entities.Schedule) bool {
	// Fill this part with attributes and its validations

	return true
}
