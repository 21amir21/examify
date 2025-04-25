package controllers

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/21amir21/examify/models"
	"github.com/21amir21/examify/services"
	"github.com/21amir21/examify/terraform"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExamRequest struct {
	Name                 string    `json:"name" binding:"required"`
	Duration             int       `json:"duration" binding:"required"`
	StartDateTime        time.Time `json:"startDateTime" binding:"required"`
	CourseName           string    `json:"courseName" binding:"required"`
	CourseCode           string    `json:"courseCode" binding:"required"`
	InstructorID         string    `json:"instructorID" binding:"required"`
	InstanceTemplateName string    `json:"instanceTemplateName" binding:"required"`
}

type InvigilationUpdateRequest struct {
	ExamID     string `json:"examID" binding:"required"`
	InstanceIP string `json:"instanceIP" binding:"required"`
	SocketID   string `json:"socketID" binding:"required"`
}

func CreateExam(c *gin.Context) {
	var req ExamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Invalid Exam Data"})
		return
	}

	var (
		instructor       *models.Instructor
		instanceTemplate *models.InstanceTemplate
		instructorErr    error
		templateErr      error
		examUniqueErr    error
	)

	InstructorObjectID, err := primitive.ObjectIDFromHex(req.InstructorID)
	if err != nil {
		instructorErr = err
		return
	}

	var wg sync.WaitGroup
	wg.Add(3)

	// Run validations in parallel
	// using 3 Go Routines
	go func() {
		defer wg.Done()
		instructor, instructorErr = services.IsInstructorEnrolledToCourse(InstructorObjectID, req.CourseName, req.CourseCode)
	}()

	go func() {
		defer wg.Done()
		instanceTemplate, templateErr = services.DoesInstanceTemplateExist(req.InstanceTemplateName)
	}()

	go func() {
		defer wg.Done()
		examUniqueErr = services.IsExamUnique(req.Name)
	}()

	if instructorErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": instructorErr.Error()})
		return
	}
	if templateErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": templateErr.Error()})
		return
	}
	if examUniqueErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": examUniqueErr.Error()})
		return
	}

	terraformDir := "terraform/exam_vpc"
	terraformRunner := terraform.NewTerraformRunner(terraformDir)

	start := time.Now()

	terraformResult, err := terraformRunner.CreateInfrastructure(req.Name, nil)
	if err != nil {
		log.Println("Terraform Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failure to create exam, please try again later."})
		return
	}

	log.Printf("Exam network infrastructure created in: %v ms\n", time.Since(start).Milliseconds())

	err = services.CreateExam(req.Name, req.Duration, req.StartDateTime.String(), instructor.ID, req.CourseName, req.CourseCode, *instanceTemplate, terraformResult)
	if err != nil {
		log.Println("Exam Creation Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failure to create exam, please try again later."})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Exam created successfully!"})
}

func UpdateExamInvigilationInfo(c *gin.Context) {
	var req struct {
		ExamID     primitive.ObjectID `json:"examID" binding:"required"`
		InstanceIP string             `json:"instanceIP" binding:"required"`
		SocketID   string             `json:"socketID" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Invalid invigilation data", "details": err.Error()})
		return
	}

	if err := services.UpdateExamInvigilationInfo(req.ExamID, req.InstanceIP, req.SocketID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Exam invigilation info updated successfully!"})
}

func GetExam(c *gin.Context) {
	examID := c.Query("examID")
	if examID == "" {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Missing examID in query"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(examID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid examID format"})
		return
	}

	exam, err := services.GetExam(objectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"exam": exam})
}
