package entities

import "github.com/google/uuid"

type Follow struct {
	Id        uuid.UUID `gorm:"primaryKey" json:"id"`
	User      User      `gorm:"not null" json:"user_id"`
	Following User      `gorm:"not null" json:"following_id"`
}
