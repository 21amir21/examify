package services

import (
	"context"
	"errors"
	"time"

	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var timeout = 10 * time.Second
var StudentCollection = db.GetCollection("students")
var ExamCollection = db.GetCollection("exams")

func GetStudentExams(studentUsername string) ([]models.Exam, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var student models.Student
	err := StudentCollection.FindOne(ctx, bson.M{"username": studentUsername}).Decode(&student)
	if err != nil {
		return nil, err
	}

	if student.Username == "" {
		return nil, errors.New("no student with the given username exists")
	}

	// Fetch the full Exam documents using the enrolled exam IDs similar to populate()
	filter := bson.M{"_id": bson.M{"$in": student.EnrolledExams}}
	curser, err := ExamCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer curser.Close(ctx)

	var exams []models.Exam
	for curser.Next(ctx) {
		var exam models.Exam
		if err := curser.Decode(&exam); err != nil {
			return nil, err
		}
		exams = append(exams, exam)
	}

	if err := curser.Err(); err != nil {
		return nil, err
	}

	return exams, nil
}

func GetCurrentExam(studentUsername string) (models.CurrentExam, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var student models.Student
	err := StudentCollection.FindOne(ctx, bson.M{"username": studentUsername}).Decode(&student)
	if err != nil {
		return models.CurrentExam{}, err
	}

	if student.Username == "" {
		return models.CurrentExam{}, errors.New("no student with the given username exists")
	}

	if student.CurrentExam.ExamDetails.ID.IsZero() {
		return models.CurrentExam{}, errors.New("there is no current exam registered, please connect to an exam")
	}

	return student.CurrentExam, nil
}

func IsStudentEnrolledIntoExam(studentUsername string, examID primitive.ObjectID) (*models.Student, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	filter := bson.M{
		"username":      studentUsername,
		"enrolledExams": examID,
	}

	var student models.Student
	err := StudentCollection.FindOne(ctx, filter).Decode(&student)
	if err != nil {
		return nil, err
	}

	if student.Username == "" {
		return nil, errors.New("no student with the given username is enrolled to the given exam")
	}

	return &student, nil
}

func SetCurrentExam(studentUsername string, examID primitive.ObjectID, instanceIP string, instancePassword string) (*models.Student, error) {
	// Step 1: Make sure the student is enrolled in the exam
	student, err := IsStudentEnrolledIntoExam(studentUsername, examID)
	if err != nil {
		return nil, err
	}

	// Step 2: Fetch the exam from the database
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var exam models.Exam
	err = ExamCollection.FindOne(ctx, bson.M{"_id": examID}).Decode(&exam)
	if err != nil {
		return nil, errors.New("couldn't find the exam")
	}

	// Step 3: Inject instance info into exam's InvigilationInstance
	exam.InvigilationInstance.InstanceIP = instanceIP
	exam.InvigilationInstance.InstancePassword = instancePassword

	// Step 4: Set this exam as the student's current exam
	student.CurrentExam.ExamDetails = exam

	_, err = StudentCollection.UpdateOne(ctx,
		bson.M{"_id": examID},
		bson.M{"$set": bson.M{"currentExam": exam}},
	)
	if err != nil {
		return nil, errors.New("couldn't update student's current exam")
	}

	return student, nil
}
