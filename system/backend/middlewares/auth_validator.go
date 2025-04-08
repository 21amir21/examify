package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name,omitempty"`
	Role     string `json:"role"`
}

func LoginValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload AuthPayload

		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			c.Abort()
			return
		}

		if payload.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username must not be empty"})
			c.Abort()
			return
		}

		if payload.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password must not be empty"})
			c.Abort()
			return
		}

		if payload.Role != "Student" && payload.Role != "Instructor" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be a Student or an Instructor"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func RegisterValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload AuthPayload

		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			c.Abort()
			return
		}

		if payload.Username == "" || payload.Password == "" || payload.Name == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, Password, and Name must not be empty"})
			c.Abort()
			return
		}

		if payload.Role != "Student" && payload.Role != "Instructor" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be a Student or an Instructor"})
			c.Abort()
			return
		}

		c.Next()
	}
}
