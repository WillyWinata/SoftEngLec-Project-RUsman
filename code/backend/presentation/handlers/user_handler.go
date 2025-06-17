package handlers

import (
	"log"
	"net/http"
	"time"

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
	GetUserFollowResponse(c *gin.Context)
	CheckSession(c *gin.Context)
	Logout(c *gin.Context)
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

func (h *userHandler) Logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   false,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

func (h *userHandler) CheckSession(c *gin.Context) {
	cookie, err := c.Request.Cookie("session_token")
	if err != nil || cookie.Value == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No valid session"})
		return
	}

	userId, err := uuid.Parse(cookie.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
		return
	}

	user, err := h.service.GetUserByID(userId.String())
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userId": user.Id,
		"role":   user.Role,
	})
}

func (h *userHandler) Login(c *gin.Context) {
	var loginData struct {
		Email      string `json:"email"`
		Password   string `json:"password"`
		RememberMe bool   `json:"rememberMe"`
	}

	if err := c.BindJSON(&loginData); err != nil {
		log.Panicln(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	user, err := h.service.Login(loginData.Email, loginData.Password)
	if err != nil {
		if err == services.ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else if err == services.ErrWrongPassword {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	sessionToken := user.Id.String()

	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   false,
	}

	if loginData.RememberMe {
		cookie.Expires = time.Now().Add(30 * 24 * time.Hour)
	}

	http.SetCookie(c.Writer, cookie)

	c.JSON(http.StatusOK, user)
}

func (h *userHandler) Get(c *gin.Context) {
	id := c.Param("id")

	user, err := h.service.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userResponse := &entities.UserFrontendResponse{
		Id:             user.Id.String(),
		Name:           user.Name,
		StudentId:      user.StudentId,
		Role:           user.Role,
		Major:          user.Major,
		ProfilePicture: user.ProfilePicture,
		IsActive:       user.IsActive,
	}

	c.JSON(http.StatusOK, userResponse)
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

func (h *userHandler) GetUserFollowResponse(c *gin.Context) {
	id := c.Param("id")

	userId, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.service.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	followers, err := h.service.GetFollowersByUser(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	following, err := h.service.GetFollowingByUser(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	followingPending, err := h.service.GetFollowingPendingRequestsByUser(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	response := entities.UserFollowResponse{
		User:             user,
		Follower:         followers,
		Following:        following,
		FollowingPending: followingPending,
	}

	c.JSON(http.StatusOK, response)
}
