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
	r.GET("/get-user-follow/:id", userHandler.GetUserFollowResponse)

	scheduleHandler := handlers.NewScheduleHandler()
	r.POST("/create-schedule", scheduleHandler.Create)
	r.GET("/get-schedule/:id", scheduleHandler.Get)
	r.POST("/get-schedules", scheduleHandler.GetAll)
	r.PUT("/update-schedule/:id", scheduleHandler.Update)
	r.DELETE("/delete-schedule/:id", scheduleHandler.Delete)
	r.GET("/get-schedules-request-by-user/:id", scheduleHandler.GetAllScheduleRequestsByUser)
	r.GET("/get-schedules-request-by-schedule/:id", scheduleHandler.GetAllScheduleRequestsBySchedule)
	r.GET("/get-schedules-accepted-by-schedule/:id", scheduleHandler.GetAllAcceptedSchedulesBySchedule)
	r.PATCH("/accept-schedule", scheduleHandler.AcceptSchedule)
	r.PATCH("/reject-schedule", scheduleHandler.RejectSchedule)

	followHandler := handlers.NewFollowHandler()
	r.POST("/get-follows-by-user", followHandler.GetFollowsByUser)

	followRequestHandler := handlers.NewFollowRequestHandler()
	r.POST("/request-follow", followRequestHandler.CreateFollowRequest)
	r.POST("/get-all-requests-by-user", followRequestHandler.GetAllByUser)
	r.POST("/get-all-requests-by-requestee", followRequestHandler.GetAllByRequestee)
	r.PATCH("/accept-request", followRequestHandler.AcceptFollowRequest)
	r.PATCH("/reject-request", followRequestHandler.RejectFollowRequest)
}
