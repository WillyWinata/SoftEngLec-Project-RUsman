package entities

import "github.com/google/uuid"

type User struct {
	Id             uuid.UUID `gorm:"primaryKey" json:"id"`
	Name           string    `gorm:"not null" json:"name"`
	Email          string    `gorm:"not null" json:"email"`
	Password       string    `gorm:"not null" json:"password"`
	Role           string    `gorm:"not null" json:"role"`
	Major          string    `gorm:"not null" json:"major"`
	ProfilePicture string    `gorm:"not null" json:"profilePicture"`
}
