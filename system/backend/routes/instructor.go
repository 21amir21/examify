package routes

import (
	"github.com/21amir21/examify/controllers"
	"github.com/21amir21/examify/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterInstructorRoutes(routes *gin.Engine) {
	instructor := routes.Group("/instructor")
	{
		instructor.GET("/courses", middlewares.GetInstructorCoursesValidator(), controllers.GetInstructorCourses)
		instructor.GET("/exams", middlewares.GetInstructorExamsValidator(), controllers.GetInstructorExams)
	}
}
