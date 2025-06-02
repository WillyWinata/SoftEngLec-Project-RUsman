package handlers

import (
	"net/http"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/application/services"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
   TODO: Copy the code below to route.go

   followHandler := handlers.NewFollowHandler()
   r.POST("/create-follow", followHandler.Create)
   r.GET("/get-follow/:id", followHandler.Get)
   r.GET("/get-follows", followHandler.GetAll)
   r.PUT("/update-follow/:id", followHandler.Update)
   r.DELETE("/delete-follow/:id", followHandler.Delete)
*/

type FollowHandler interface {
	Follow(c *gin.Context)
	GetFollowsByUser(c *gin.Context)
}

type followHandler struct {
	service services.FollowService
}

func NewFollowHandler() FollowHandler {
	return &followHandler{
		service: services.NewFollowService(),
	}
}

func (h *followHandler) Follow(c *gin.Context) {
	var Follow entities.Follow

	if err := c.ShouldBindJSON(&Follow); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.Follow(Follow); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Follow created"})
}

func (h *followHandler) GetFollowsByUser(c *gin.Context) {
	type FollowID struct {
		UserId uuid.UUID
	}

	var userId FollowID

	if err := c.ShouldBindJSON(&userId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	follows, err := h.service.GetFollowsByUser(userId.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, follows)
}
