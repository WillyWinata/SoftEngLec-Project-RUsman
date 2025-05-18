package routes

import (
	"github.com/WillyWinata/WebDevelopment-Personal/backend/presentation/handlers"
	"github.com/gin-gonic/gin"
)

func InitRoutes(r *gin.Engine) {
	userHandler := handlers.NewUserHandler()
	r.POST("/create-user", userHandler.Create)
	r.POST("/login-user", userHandler.Login)
	r.GET("/get-user/:id", userHandler.Get)
	r.GET("/get-users", userHandler.GetAll)
	r.PUT("/update-user/:id", userHandler.Update)
	r.DELETE("/delete-user/:id", userHandler.Delete)
}
