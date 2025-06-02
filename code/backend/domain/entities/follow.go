package entities

import "github.com/google/uuid"

type Follow struct {
	Id        uuid.UUID `gorm:"primaryKey" json:"id"`
	User      User      `gorm:"not null" json:"userId"`
	Following User      `gorm:"not null" json:"followingId"`
}
