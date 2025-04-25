package middlewares

import (
	"net"
	"net/http"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateExamPayload struct {
	Name                 string `json:"name"`
	Duration             int    `json:"duration"`
	StartDateTime        string `json:"startDateTime"`
	CourseCode           string `json:"courseCode"`
	CourseName           string `json:"courseName"`
	InstructorID         string `json:"instructorID"`
	InstanceTemplateName string `json:"instanceTemplateName"`
}

type UpdateInvigilationInfoPayload struct {
	ExamID     string `json:"examID"`
	InstanceIP string `json:"instanceIP"`
	SocketID   string `json:"socketID"`
}

type ExamIDPayload struct {
	ExamID string `json:"examID"`
}

func CreateExamValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload CreateExamPayload
		var errors []string

		if err := c.ShouldBindJSON(&payload); err != nil {
			errors = append(errors, "Invalid request body")
		}

		// Name checks
		if payload.Name == "" {
			errors = append(errors, "Exam name must not be empty.")
		} else {
			matched, _ := regexp.MatchString(`^\S*$`, payload.Name)
			if !matched {
				errors = append(errors, "Exam name must not contain spaces.")
			}
		}

		// Duration
		if payload.Duration == 0 {
			errors = append(errors, "Exam duration must not be empty.")
		} else if payload.Duration < 60 {
			errors = append(errors, "Exam duration must be at least 60 minutes.")
		}

		// ISO8601 datetime check
		if _, err := time.Parse(time.RFC3339, payload.StartDateTime); err != nil {
			errors = append(errors, "Start date time must follow ISO 8601. Example: 2020-01-01T00:00:00Z")
		}

		if payload.CourseCode == "" {
			errors = append(errors, "Course code must not be empty.")
		}
		if payload.CourseName == "" {
			errors = append(errors, "Course name must not be empty.")
		}
		if payload.InstructorID == "" {
			errors = append(errors, "Instructor ID (createdBy) must not be empty.")
		}
		if payload.InstanceTemplateName == "" {
			errors = append(errors, "Instance template must not be empty.")
		}

		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": errors})
			c.Abort()
			return
		}
		c.Next()
	}
}

func UpdateExamInvigilationInfoValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload UpdateInvigilationInfoPayload
		var errors []string

		if err := c.ShouldBindJSON(&payload); err != nil {
			errors = append(errors, "Invalid request body")
		}

		if payload.ExamID == "" {
			errors = append(errors, "Exam ID must not be empty.")
		}
		if payload.InstanceIP == "" {
			errors = append(errors, "Invigilation instance IP cannot be empty.")
		} else if net.ParseIP(payload.InstanceIP) == nil {
			errors = append(errors, "Invigilation instance IP must be in a correct IP format.")
		}
		if payload.SocketID == "" {
			errors = append(errors, "Socket ID cannot be empty.")
		}

		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": errors})
			c.Abort()
			return
		}
		c.Next()
	}
}

func GetExamValidator() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload ExamIDPayload
		if err := c.ShouldBindJSON(&payload); err != nil || payload.ExamID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Exam ID must not be empty."})
			c.Abort()
			return
		}
		c.Next()
	}
}
