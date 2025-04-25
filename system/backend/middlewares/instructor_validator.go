package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type InstructorQueryPayload struct {
	Username string `form:"username"`
}

func GetInstructorCoursesValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var query InstructorQueryPayload
		if err := c.ShouldBindQuery(&query); err != nil || query.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username must not be empty"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func GetInstructorExamsValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var query InstructorQueryPayload
		if err := c.ShouldBindQuery(&query); err != nil || query.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username must not be empty"})
			c.Abort()
			return
		}
		c.Next()
	}
}
