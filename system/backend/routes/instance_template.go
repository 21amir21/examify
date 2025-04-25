package routes

import (
	"github.com/21amir21/examify/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterInstanceTemplateRoutes(routes *gin.Engine) {
	instanceTemplate := routes.Group("/instance-template")
	{
		instanceTemplate.GET("/", controllers.GetInstanceTemplates)
	}
}
