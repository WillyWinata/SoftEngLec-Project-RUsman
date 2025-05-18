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

   userHandler := handlers.NewUserHandler()
   r.POST("/create-user", userHandler.Create)
   r.GET("/get-user/:id", userHandler.Get)
   r.GET("/get-users", userHandler.GetAll)
   r.PUT("/update-user/:id", userHandler.Update)
   r.DELETE("/delete-user/:id", userHandler.Delete)
*/

type UserHandler interface {
	Create(c *gin.Context)
	Get(c *gin.Context)
	Login(c *gin.Context)
	GetAll(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

type userHandler struct {
	service services.UserService
}

func NewUserHandler() UserHandler {
	return &userHandler{
		service: services.NewUserService(),
	}
}

func (h *userHandler) Create(c *gin.Context) {
	var User entities.User

	if err := c.ShouldBindJSON(&User); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.service.CreateNewUser(User); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}

func (h *userHandler) Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	User, err := h.service.Login(loginData.Email, loginData.Password)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, User)
}

func (h *userHandler) Get(c *gin.Context) {
	id := c.Param("id")

	User, err := h.service.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, User)
}

func (h *userHandler) GetAll(c *gin.Context) {
	Users, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, Users)
}

func (h *userHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var User entities.User

	if err := c.ShouldBindJSON(&User); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	User.Id = uuid.MustParse(id)
	if err := h.service.UpdateUser(User); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated"})
}

func (h *userHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
