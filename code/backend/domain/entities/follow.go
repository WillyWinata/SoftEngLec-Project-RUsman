package entities

import "github.com/google/uuid"

type Follow struct {
	Id        uuid.UUID `gorm:"primaryKey" json:"id"`
	User      uuid.UUID `gorm:"not null" json:"userId"`
	Following uuid.UUID `gorm:"not null" json:"followingId"`
}
