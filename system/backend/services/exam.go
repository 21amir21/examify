package services

import (
	"context"
	"errors"
	"time"

	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/models"
	"github.com/21amir21/examify/terraform"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// IsExamUnique check if exam name is unique
func IsExamUnique(name string) error {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var exam models.Exam
	err := ExamCollection.FindOne(ctx, bson.M{"name": name}).Decode(&exam)
	if err != nil {
		return err
	}

	return nil
}

// CreateExam creates a new exam and update student/instructor info
func CreateExam(name string, duration int, startDateTime string, instructorID primitive.ObjectID, courseName, courseCode string, instanceTemplate models.InstanceTemplate, terraformResult map[string]terraform.TFOutputValue) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	examColl := db.GetCollection("exams")
	coursesColl := db.GetCollection("courses")
	studentsColl := db.GetCollection("students")
	instructorsColl := db.GetCollection("instructors")

	session, err := db.MongoClient.StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	err = mongo.WithSession(ctx, session, func(sc mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		var course models.Course
		if err := coursesColl.FindOne(sc, bson.M{"code": courseCode}).Decode(&course); err != nil {
			return err
		}

		exam := models.Exam{
			Name:             name,
			Duration:         duration,
			StartDateTime:    startDateTime,
			CourseName:       courseName,
			CreatedBy:        instructorID,
			InstanceTemplate: instanceTemplate,
			VPCID:            terraformResult["vpc_id"].Value.(string),
			SGID:             terraformResult["sg_id"].Value.(string),
			EnrolledStudents: course.EnrolledStudents,
		}

		res, err := examColl.InsertOne(sc, exam)
		if err != nil {
			return err
		}
		examID := res.InsertedID.(primitive.ObjectID)

		_, err = studentsColl.UpdateMany(
			sc,
			bson.M{"enrolledCourses": course.ID},
			bson.M{"$push": bson.M{"enrolledExams": examID}},
		)
		if err != nil {
			return err
		}

		_, err = instructorsColl.UpdateMany(
			sc,
			bson.M{"assignedCourses": course.ID},
			bson.M{"$push": bson.M{"assignedExams": examID}},
		)
		if err != nil {
			return err
		}

		return session.CommitTransaction(sc)
	})

	return err
}

// GetExam gets exam by ID with extra fields
func GetExam(examID primitive.ObjectID) (*models.Exam, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var exam models.Exam
	err := db.GetCollection("exams").FindOne(ctx, bson.M{"_id": examID}).Decode(&exam)
	if err != nil {
		return nil, errors.New("no exam with the given ID exists")
	}

	return &exam, nil
}

// UpdateExamInvigilationInfo updates invigilation info
func UpdateExamInvigilationInfo(examID primitive.ObjectID, instanceIP string, socketID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	examsColl := db.GetCollection("exams")

	updateFilter := bson.M{
		"$set": bson.M{
			"invigilationInstance.instanceIP": instanceIP,
			"invigilationInstance.socketID":   socketID,
		},
	}

	_, err := examsColl.UpdateByID(ctx, examID, updateFilter)
	if err != nil {
		return err
	}

	return nil
}
