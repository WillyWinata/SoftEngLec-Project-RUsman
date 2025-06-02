package repositories

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FollowRequestRepository interface {
	CreateNewFollowRequest(model entities.FollowRequest) error
	GetFollowRequestsByUser(userId uuid.UUID) (entities.FollowRequest, error)
	GetFollowRequestsByRequestee(requesteeId uuid.UUID) ([]entities.FollowRequest, error)
	AcceptFollowRequest(requestId uuid.UUID) error
	RejectFollowRequest(requestId uuid.UUID) error
	GetFollowByID(requestId uuid.UUID) (entities.FollowRequest, error)
	GetFollowingPendingRequestsByUser(userId uuid.UUID) ([]entities.FollowRequest, error)
}

type followRequestRepository struct {
	db *gorm.DB
}

func NewFollowRequestRepository() FollowRequestRepository {
	return &followRequestRepository{db: database.GetDB()}
}

func (r *followRequestRepository) CreateNewFollowRequest(model entities.FollowRequest) error {
	return r.db.Create(&model).Error
}

func (r *followRequestRepository) GetFollowRequestsByUser(userId uuid.UUID) (entities.FollowRequest, error) {
	var entity entities.FollowRequest

	err := r.db.Where("user_id = ?", userId).First(&entity).Error
	return entity, err
}

func (r *followRequestRepository) GetFollowRequestsByRequestee(requesteeId uuid.UUID) ([]entities.FollowRequest, error) {
	var entities []entities.FollowRequest

	err := r.db.Where("requestee_id = ?", requesteeId).Find(&entities).Error
	return entities, err
}

func (r *followRequestRepository) AcceptFollowRequest(requestId uuid.UUID) error {
	return r.db.Model(&entities.FollowRequest{}).Where("request_id = ?", requestId).Update("status", "Accepted").Error
}

func (r *followRequestRepository) RejectFollowRequest(requestId uuid.UUID) error {
	return r.db.Model(&entities.FollowRequest{}).Where("request_id = ?", requestId).Update("status", "Rejected").Error
}

func (r *followRequestRepository) GetFollowByID(requestId uuid.UUID) (entities.FollowRequest, error) {
	var entity entities.FollowRequest

	err := r.db.First(&entity, requestId).Error

	return entity, err
}

func (r *followRequestRepository) GetFollowingPendingRequestsByUser(userId uuid.UUID) ([]entities.FollowRequest, error) {
	var entities []entities.FollowRequest

	err := r.db.Where("requestee_id = ? AND status = ?", userId, "Pending").Find(&entities).Error
	return entities, err
}
