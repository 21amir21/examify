package routes

import (
	"github.com/21amir21/examify/controllers"
	"github.com/21amir21/examify/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(routes *gin.Engine) {
	auth := routes.Group("/auth")
	{
		auth.POST("/login", middlewares.LoginValidator(), controllers.Login)
		auth.POST("/register", middlewares.RegisterValidator(), controllers.Register)
	}

}
