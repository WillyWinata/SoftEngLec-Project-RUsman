package entities

import (
	"time"

	"github.com/google/uuid"
)

type Schedule struct {
	Id           uuid.UUID `gorm:"primaryKey" json:"id"`
	UserId       uuid.UUID `gorm:"not null" json:"userId"`
	StartTime    time.Time `gorm:"not null" json:"startTime"`
	EndTime      time.Time `gorm:"not null" json:"endTime"`
	Title        string    `gorm:"not null" json:"title"`
	Description  string    `gorm:"not null" json:"description"`
	Status       string    `gorm:"not null" json:"status"`
	Type         string    `gorm:"not null" json:"type"`
	Location     string    `gorm:"not null" json:"location"`
	Category     string    `gorm:"not null" json:"category"`
	Participants []User    `gorm:"many2many:schedule_participants;" json:"participants"`
	Color        string    `gorm:"not null" json:"color"`
}
