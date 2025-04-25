package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/21amir21/examify/models"
	"github.com/21amir21/examify/services"
	"github.com/21amir21/examify/terraform"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CurrentExamWithDetails struct {
	ExamDetails      models.Exam             `json:"examDetails"`
	AssignedInstance models.AssignedInstance `json:"assignedInstance"`
}

func GetStudentExams(c *gin.Context) {
	username := c.Query("username")

	enrolledExams, err := services.GetStudentExams(username)
	if err != nil {
		c.JSON(http.StatusNotFound, err)
		return
	}

	var studentExams []gin.H
	for _, exam := range enrolledExams {
		studentExams = append(studentExams, gin.H{
			"id":                   exam.ID,
			"name":                 exam.Name,
			"courseName":           exam.CourseName,
			"duration":             exam.Duration,
			"startDateTime":        exam.StartDateTime,
			"invigilationSocketID": exam.InvigilationInstance.SocketID,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"studentExams": studentExams,
	})
}

func GetCurrentExam(c *gin.Context) {
	username := c.Query("username")

	currentExam, err := services.GetCurrentExam(username)
	if err != nil {
		c.JSON(http.StatusNotFound, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"examDetails": gin.H{
			"examName":     currentExam.ExamDetails.Name,
			"examDuration": currentExam.ExamDetails.Duration,
		},
		"instanceDetails": currentExam.AssignedInstance,
	})
}

func ConnectToExam(c *gin.Context) {
	var req struct {
		Username string             `json:"username" binding:"required"`
		ExamID   primitive.ObjectID `json:"examID" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err)
		return
	}

	examID := req.ExamID
	username := req.Username

	if _, err := services.IsStudentEnrolledIntoExam(username, examID); err != nil {
		c.JSON(http.StatusBadRequest, err)
	}

	exam, err := services.GetExam(examID)
	if err != nil {
		c.JSON(http.StatusNotFound, err)
		return
	}

	tfDir := "terraform/exam_instance"
	tfVars := []terraform.TFVariable{
		{Name: "vpc_id", Value: exam.VPCID},
		{Name: "security_group_id", Value: exam.SGID},
	}

	workspaceName := username + "_" + examID.Hex()
	tfRunner := terraform.NewTerraformRunner(tfDir)

	// ⏱ Start measuring time
	start := time.Now()

	tfResult, err := tfRunner.CreateInfrastructure(workspaceName, tfVars)

	// ⏱ End and log the time taken
	elapsed := time.Since(start)
	log.Printf("Exam instance creation and fully ready time: %s", elapsed)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't connect you to exam, please try again later."})
		return
	}

	instanceIP, ok := tfResult["instance_ip"]
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Missing instance_ip from output"})
		return
	}

	tempPassword, ok := tfResult["temp_password"]
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Missing temp_password from output"})
		return
	}

	// extract the actual value
	instanceIPStr, ok := instanceIP.Value.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid format for instance_ip"})
		return
	}

	tempPasswordStr, ok := tempPassword.Value.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid format for temp_password"})
		return
	}

	if _, err := services.SetCurrentExam(username, examID, instanceIPStr, tempPasswordStr); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't connect you to exam, please try again later."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg":          "Instance created successfully.",
		"publicIP":     instanceIPStr,
		"tempPassword": tempPasswordStr,
	})

}
