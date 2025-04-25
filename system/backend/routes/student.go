package routes

import (
	"github.com/21amir21/examify/controllers"
	"github.com/21amir21/examify/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterStudentRoutes(routes *gin.Engine) {
	student := routes.Group("/student")
	{
		student.GET("/exams", middlewares.GetStudentExamsValidator(), controllers.GetStudentExams)
		student.GET("/get-current-exam", middlewares.GetStudentExamsValidator(), controllers.GetCurrentExam)
		student.PATCH("/connect-to-exam", middlewares.ConnectToExamValidator(), controllers.ConnectToExam)
	}
}
