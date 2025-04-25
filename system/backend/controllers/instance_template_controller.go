package controllers

import (
	"net/http"

	"github.com/21amir21/examify/services"
	"github.com/gin-gonic/gin"
)

// GetInstanceTemplates handles the request to fetch all instance templates
func GetInstanceTemplates(c *gin.Context) {
	instanceTemplates, err := services.GetInstanceTemplates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch instance templates"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"instanceTemplates": instanceTemplates,
	})
}
