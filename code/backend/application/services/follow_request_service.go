package services

import (
	"errors"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database/repositories"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FollowRequestService interface {
	CreateNewFollowRequest(req entities.FollowRequest) error
	GetFollowRequestsByUser(userId uuid.UUID) (entities.FollowRequest, error)
	GetFollowRequestsByRequestee(requesteeId uuid.UUID) ([]entities.FollowRequest, error)
	AcceptFollowRequest(requestId uuid.UUID) error
	RejectFollowRequest(requestId uuid.UUID) error
}

type followRequestService struct {
	repo          repositories.FollowRequestRepository
	followService FollowService
}

func NewFollowRequestService() FollowRequestService {
	return &followRequestService{
		repo:          repositories.NewFollowRequestRepository(),
		followService: NewFollowService(),
	}
}

func (s *followRequestService) CreateNewFollowRequest(FollowRequest entities.FollowRequest) error {
	err := s.repo.CreateNewFollowRequest(FollowRequest)
	if err != nil {
		return err
	}

	return nil
}

func (s *followRequestService) GetFollowRequestsByUser(userId uuid.UUID) (entities.FollowRequest, error) {
	followRequest, err := s.repo.GetFollowRequestsByUser(userId)
	if err != nil {
		return entities.FollowRequest{}, err
	}

	return followRequest, nil
}

func (s *followRequestService) GetFollowRequestsByRequestee(requesteeId uuid.UUID) ([]entities.FollowRequest, error) {
	followRequests, err := s.repo.GetFollowRequestsByRequestee(requesteeId)
	if err != nil {
		return nil, err
	}

	return followRequests, nil
}

func (s *followRequestService) AcceptFollowRequest(requestId uuid.UUID) error {
	request, err := s.repo.GetFollowByID(requestId)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	follow := entities.Follow{
		Id:        uuid.New(),
		User:      request.User,
		Following: request.Requestee,
	}

	err = s.followService.Follow(follow)
	if err != nil {
		return err
	}

	err = s.repo.AcceptFollowRequest(requestId)
	if err != nil {
		return err
	}

	return nil
}

func (s *followRequestService) RejectFollowRequest(requestId uuid.UUID) error {
	err := s.repo.RejectFollowRequest(requestId)
	if err != nil {
		return err
	}

	return nil
}

func ValidateFollowRequest(FollowRequest entities.FollowRequest) bool {
	// Fill this part with attributes and its validations

	return true
}
