package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/WillyWinata/WebDevelopment-Personal/backend/application/services"
	"github.com/WillyWinata/WebDevelopment-Personal/backend/domain/entities"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
   TODO: Copy the code below to route.go

   scheduleHandler := handlers.NewScheduleHandler()
   r.POST("/create-schedule", scheduleHandler.Create)
   r.GET("/get-schedule/:id", scheduleHandler.Get)
   r.GET("/get-schedules", scheduleHandler.GetAll)
   r.PUT("/update-schedule/:id", scheduleHandler.Update)
   r.DELETE("/delete-schedule/:id", scheduleHandler.Delete)
*/

type ScheduleHandler interface {
	Create(c *gin.Context)
	Get(c *gin.Context)
	GetAll(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

type scheduleHandler struct {
	service services.ScheduleService
}

func NewScheduleHandler() ScheduleHandler {
	return &scheduleHandler{
		service: services.NewScheduleService(),
	}
}

func (h *scheduleHandler) Create(c *gin.Context) {
	type ScheduleRequest struct {
		UserId       string          `json:"userId"`
		StartTime    string          `json:"startTime"`
		EndTime      string          `json:"endTime"`
		Title        string          `json:"title"`
		Description  string          `json:"description"`
		Status       string          `json:"status"`
		Type         string          `json:"type"`
		Location     string          `json:"location"`
		Category     string          `json:"category"`
		Participants []entities.User `json:"participants"`
		Color        string          `json:"color"`
	}

	var scheduleRequest ScheduleRequest

	if err := c.ShouldBindJSON(&scheduleRequest); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	startTime, err := time.Parse("2006-01-02T15:04:05", scheduleRequest.StartTime)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time"})
		return
	}

	endTime, err := time.Parse("2006-01-02T15:04:05", scheduleRequest.EndTime)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time"})
		return
	}
	schedule := entities.Schedule{
		Id:           uuid.New(),
		UserId:       uuid.MustParse(scheduleRequest.UserId),
		StartTime:    startTime,
		EndTime:      endTime,
		Title:        scheduleRequest.Title,
		Description:  scheduleRequest.Description,
		Status:       scheduleRequest.Status,
		Type:         scheduleRequest.Type,
		Location:     scheduleRequest.Location,
		Category:     scheduleRequest.Category,
		Participants: scheduleRequest.Participants,
		Color:        scheduleRequest.Color,
	}

	if err := h.service.CreateNewSchedule(schedule); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Schedule created"})
}

func (h *scheduleHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	Schedule, err := h.service.GetScheduleByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		return
	}

	c.JSON(http.StatusOK, Schedule)
}

func (h *scheduleHandler) GetAll(c *gin.Context) {
	type UserID struct {
		UserID string `json:"userID"`
	}

	var userID UserID

	if err := c.ShouldBindJSON(&userID); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	Schedules, err := h.service.GetAllSchedules(userID.UserID)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, Schedules)
}

func (h *scheduleHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var Schedule entities.Schedule

	if err := c.ShouldBindJSON(&Schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	Schedule.Id = uuid.MustParse(id)
	if err := h.service.UpdateSchedule(Schedule); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Schedule updated"})
}

func (h *scheduleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	if err := h.service.DeleteSchedule(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Schedule deleted"})
}
