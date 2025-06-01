package repositories

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/infrastructure/database"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FollowRepository interface {
	CreateNewFollow(model entities.Follow) error
	GetFollowByUser(userId uuid.UUID) ([]entities.Follow, error)
	DeleteFollow(model entities.Follow) error
	GetFollowByUserAndFollower(userId uuid.UUID, followerId uuid.UUID) (entities.Follow, error)
}

type followRepository struct {
	db *gorm.DB
}

func NewFollowRepository() FollowRepository {
	return &followRepository{db: database.GetDB()}
}

func (r *followRepository) CreateNewFollow(model entities.Follow) error {
	return r.db.Create(&model).Error
}

func (r *followRepository) GetFollowByUser(userId uuid.UUID) ([]entities.Follow, error) {
	var entity []entities.Follow

	err := r.db.Where("user_id = ?", userId).Find(&entity).Error
	return entity, err
}

func (r *followRepository) DeleteFollow(model entities.Follow) error {
	return r.db.Delete(model).Error
}

func (r *followRepository) GetFollowByUserAndFollower(userId uuid.UUID, followerId uuid.UUID) (entities.Follow, error) {
	var entity entities.Follow

	err := r.db.Where("user_id = ?", userId).Where("follower_id = ?", followerId).First(entity).Error

	return entity, err
}
