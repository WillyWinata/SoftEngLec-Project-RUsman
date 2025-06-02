package entities

import "github.com/google/uuid"

type FollowRequest struct {
	Id        uuid.UUID `gorm:"primaryKey" json:"id"`
	User      User      `gorm:"not null" json:"userId"`
	Requestee User      `gorm:"not null" json:"requesteeId"`
	Status    string    `gorm:"not null;default:Pending" json:"status"`
}
