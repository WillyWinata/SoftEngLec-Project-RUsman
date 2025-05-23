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

	scheduleHandler := handlers.NewScheduleHandler()
	r.POST("/create-schedule", scheduleHandler.Create)
	r.GET("/get-schedule/:id", scheduleHandler.Get)
	r.POST("/get-schedules", scheduleHandler.GetAll)
	r.PUT("/update-schedule/:id", scheduleHandler.Update)
	r.DELETE("/delete-schedule/:id", scheduleHandler.Delete)
}
