package routes

import (
	"github.com/21amir21/examify/controllers"
	"github.com/21amir21/examify/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterExamRoutes(routes *gin.Engine) {
	exam := routes.Group("/exam")
	{
		exam.POST("/create-exam", middlewares.CreateExamValidator(), controllers.CreateExam)
		exam.PATCH("/update-exam-invigilation-info", middlewares.UpdateExamInvigilationInfoValidator(), controllers.UpdateExamInvigilationInfo)
		exam.GET("/", middlewares.GetExamValidator(), controllers.GetExam)
	}
}
