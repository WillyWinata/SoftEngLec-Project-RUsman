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

   followRequestHandler := handlers.NewFollowRequestHandler()
   r.POST("/create-follow-request", followRequestHandler.Create)
   r.GET("/get-follow-request/:id", followRequestHandler.Get)
   r.GET("/get-follow-requests", followRequestHandler.GetAll)
   r.PUT("/update-follow-request/:id", followRequestHandler.Update)
   r.DELETE("/delete-follow-request/:id", followRequestHandler.Delete)
*/

type FollowRequestHandler interface {
	CreateFollowRequest(c *gin.Context)
	GetAllByUser(c *gin.Context)
	GetAllByRequestee(c *gin.Context)
	AcceptFollowRequest(c *gin.Context)
	RejectFollowRequest(c *gin.Context)
}

type followRequestHandler struct {
	service services.FollowRequestService
}

func NewFollowRequestHandler() FollowRequestHandler {
	return &followRequestHandler{
		service: services.NewFollowRequestService(),
	}
}

func (h *followRequestHandler) CreateFollowRequest(c *gin.Context) {
	var FollowRequest entities.FollowRequest

	if err := c.ShouldBindJSON(&FollowRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.CreateNewFollowRequest(FollowRequest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "FollowRequest created"})
}

func (h *followRequestHandler) GetAllByUser(c *gin.Context) {
	type FollowRequestID struct {
		UserID uuid.UUID `json:"user_id"`
	}

	var followRequestID FollowRequestID

	if err := c.ShouldBindJSON(&followRequestID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	FollowRequest, err := h.service.GetFollowRequestsByUser(followRequestID.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "FollowRequest not found"})
		return
	}

	c.JSON(http.StatusOK, FollowRequest)
}

func (h *followRequestHandler) GetAllByRequestee(c *gin.Context) {
	type FollowRequestID struct {
		RequesteeID uuid.UUID `json:"requestee_id"`
	}

	var followRequestID FollowRequestID

	if err := c.ShouldBindJSON(&followRequestID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	FollowRequests, err := h.service.GetFollowRequestsByRequestee(followRequestID.RequesteeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, FollowRequests)
}

func (h *followRequestHandler) AcceptFollowRequest(c *gin.Context) {
	type FollowRequestID struct {
		FollowRequestID uuid.UUID `json:"follow_request_id"`
	}

	var followRequestID FollowRequestID

	if err := c.ShouldBindJSON(&followRequestID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.AcceptFollowRequest(followRequestID.FollowRequestID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FollowRequest updated"})
}

func (h *followRequestHandler) RejectFollowRequest(c *gin.Context) {
	type FollowRequestID struct {
		FollowRequestID uuid.UUID `json:"follow_request_id"`
	}

	var followRequestID FollowRequestID

	if err := c.ShouldBindJSON(&followRequestID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.RejectFollowRequest(followRequestID.FollowRequestID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FollowRequest updated"})
}
