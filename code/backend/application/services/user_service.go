package services

import (
	"errors"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database/repositories"
	"github.com/google/uuid"
)

// Define custom error variables
var (
	ErrUserNotFound  = errors.New("user not found")
	ErrWrongPassword = errors.New("wrong password")
)

type UserService interface {
	CreateNewUser(User entities.User) error
	GetUserByID(id string) (entities.User, error)
	Login(email string, password string) (entities.User, error)
	GetAllUsers() ([]entities.User, error)
	UpdateUser(User entities.User) error
	DeleteUser(id string) error
	GetFollowersByUser(userId uuid.UUID) ([]entities.User, error)
	GetFollowingByUser(userId uuid.UUID) ([]entities.User, error)
	GetFollowingPendingRequestsByUser(userId uuid.UUID) ([]entities.User, error)
}

type userService struct {
	repo              repositories.UserRepository
	followRepo        repositories.FollowRepository
	followRequestRepo repositories.FollowRequestRepository
}

func NewUserService() UserService {
	return &userService{
		repo:              repositories.NewUserRepository(),
		followRepo:        repositories.NewFollowRepository(),
		followRequestRepo: repositories.NewFollowRequestRepository(),
	}
}

func (s *userService) Login(email string, password string) (entities.User, error) {
	user, err := s.repo.FindUserByEmail(email)
	if err != nil {
		// User tidak ditemukan di database
		return entities.User{}, ErrUserNotFound // <-- Update: gunakan error khusus
	}

	// Cek password sekarang (pastikan gunakan hash password di produksi)
	if !CheckPassword(user.Password, password) { // <-- Update: cek password setelah user ditemukan
		return entities.User{}, ErrWrongPassword // <-- Update: gunakan error khusus
	}
	return user, nil
}

// Fungsi untuk cek password (dummy, ganti dengan hash checker yang aman)
func CheckPassword(hashedPassword, inputPassword string) bool {
	// TODO: Ganti dengan hash checker aman, misal bcrypt
	return hashedPassword == inputPassword // <-- Untuk demo saja!
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

func (s *userService) GetFollowersByUser(userId uuid.UUID) ([]entities.User, error) {
	followers, err := s.followRepo.GetFollowersByUser(userId)
	if err != nil {
		return nil, err
	}

	f := make([]entities.User, 0, len(followers))
	for _, follower := range followers {
		user, err := s.repo.FindUser(follower.UserId)
		if err != nil {
			continue
		}

		f = append(f, user)
	}

	return f, nil
}

func (s *userService) GetFollowingByUser(userId uuid.UUID) ([]entities.User, error) {
	following, err := s.followRepo.GetFollowingByUser(userId)
	if err != nil {
		return nil, err
	}

	f := make([]entities.User, 0, len(following))
	for _, follow := range following {
		user, err := s.repo.FindUser(follow.FollowingId)
		if err != nil {
			continue
		}

		f = append(f, user)
	}

	return f, nil
}

func (s *userService) GetFollowingPendingRequestsByUser(userId uuid.UUID) ([]entities.User, error) {
	followingPending, err := s.followRequestRepo.GetFollowingPendingRequestsByUser(userId)
	if err != nil {
		return nil, err
	}

	f := make([]entities.User, 0, len(followingPending))
	for _, pending := range followingPending {
		user, err := s.repo.FindUser(pending.RequesteeId)
		if err != nil {
			continue
		}

		f = append(f, user)
	}

	return f, nil
}

func ValidateUser(User entities.User) bool {
	// Fill this part with attributes and its validations

	return true
}
