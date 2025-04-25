package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type StudentPayload struct {
	Username string `json:"username"`
	ExamID   string `json:"examID,omitempty"`
}

func GetStudentExamsValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var body StudentPayload
		if err := c.ShouldBindJSON(&body); err != nil || body.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username must not be empty"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func ConnectToExamValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var body StudentPayload
		var errors []string

		if err := c.ShouldBindJSON(&body); err != nil {
			errors = append(errors, "Invalid request body")
		}

		if body.Username == "" {
			errors = append(errors, "Username must not be empty")
		}
		if body.ExamID == "" {
			errors = append(errors, "ExamID must not be empty")
		}

		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": errors})
			c.Abort()
			return
		}
		c.Next()
	}
}
