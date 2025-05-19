package services

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database/repositories"
	"github.com/google/uuid"
)

type UserService interface {
	CreateNewUser(User entities.User) error
	GetUserByID(id string) (entities.User, error)
	Login(email string, password string) (entities.User, error)
	GetAllUsers() ([]entities.User, error)
	UpdateUser(User entities.User) error
	DeleteUser(id string) error
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService() UserService {
	return &userService{
		repo: repositories.NewUserRepository(),
	}
}

func (s *userService) Login(email string, password string) (entities.User, error) {
	user, err := s.repo.FindUserByCredential(email, password)
	if err != nil {
		return entities.User{}, err
	}

	return user, nil
}

func (s *userService) CreateNewUser(User entities.User) error {
	err := s.repo.CreateNewUser(User)
	if err != nil {
		return err
	}

	return nil
}

func (s *userService) GetUserByID(id string) (entities.User, error) {
	User, err := s.repo.FindUser(uuid.MustParse(id))
	if err != nil {
		return entities.User{}, err
	}

	return User, nil
}

func (s *userService) GetAllUsers() ([]entities.User, error) {
	Users, err := s.repo.GetAllUsers()
	if err != nil {
		return nil, err
	}

	return Users, nil
}

func (s *userService) UpdateUser(User entities.User) error {
	err := s.repo.UpdateUser(User)
	if err != nil {
		return err
	}

	return nil
}

func (s *userService) DeleteUser(id string) error {
	err := s.repo.DeleteUser(uuid.MustParse(id))
	if err != nil {
		return err
	}

	return nil
}

func ValidateUser(User entities.User) bool {
	// Fill this part with attributes and its validations

	return true
}
