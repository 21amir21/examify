package controllers

import (
	"net/http"

	"github.com/21amir21/examify/models"
	"github.com/21amir21/examify/services"
	"github.com/gin-gonic/gin"
)

func GetInstructorCourses(c *gin.Context) {
	instructorName := c.DefaultQuery("username", "")
	if instructorName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	assignedCourses, err := services.GetInstructorCourses(instructorName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"assignedCourses": assignedCourses,
	})
}

func GetInstructorExams(c *gin.Context) {
	instructorUsername := c.DefaultQuery("username", "")
	if instructorUsername == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	assignedExams, err := services.GetInstructorExams(instructorUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exams"})
		return
	}

	instructorExams := make([]models.Exam, len(assignedExams))
	for i, exam := range assignedExams {
		instructorExams[i] = models.Exam{
			ID:                   exam.ID,
			Name:                 exam.Name,
			CourseName:           exam.CourseName,
			Duration:             exam.Duration,
			StartDateTime:        exam.StartDateTime,
			InvigilationInstance: exam.InvigilationInstance,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"instructorExams": instructorExams,
	})
}
