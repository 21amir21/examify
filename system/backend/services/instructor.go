package services

import (
	"context"
	"errors"

	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// IsInstructorEnrolledToCourse checks if instructor is assigned to a course
func IsInstructorEnrolledToCourse(instructorID primitive.ObjectID, courseName string, courseCode string) (*models.Instructor, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	coursesColl := db.GetCollection("courses")
	instructorsColl := db.GetCollection("instructors")

	// Find course
	var course models.Course
	err := coursesColl.FindOne(ctx, bson.M{"name": courseName, "code": courseCode}).Decode(&course)
	if err != nil {
		return nil, errors.New("no instructor with the given ID is assigned to the specified course")
	}

	// Find instructor assigned to course
	var instructor models.Instructor
	err = instructorsColl.FindOne(
		ctx,
		bson.M{
			"_id":             instructorID,
			"assignedCourses": course.ID,
		},
	).Decode(&instructor)
	if err != nil {
		return nil, errors.New("no instructor with the given ID is assigned to the specified course")
	}

	return &instructor, nil
}

// GetInstructorCourses gets assigned courses for instructor
func GetInstructorCourses(username string) ([]models.Course, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	instructorsColl := db.GetCollection("instructors")
	coursesColl := db.GetCollection("courses")

	var instructor models.Instructor
	err := instructorsColl.FindOne(ctx, bson.M{"username": username}).Decode(&instructor)
	if err != nil {
		return nil, errors.New("no instructor with the given username exists")
	}

	// Populate assigned courses
	coursesCursor, err := coursesColl.Find(ctx, bson.M{"_id": bson.M{"$in": instructor.AssignedCourses}})
	if err != nil {
		return nil, errors.New("couldn't get instructor's courses")
	}
	defer coursesCursor.Close(ctx)

	var courses []models.Course
	if err := coursesCursor.All(ctx, &courses); err != nil {
		return nil, errors.New("couldn't get instructor's courses")
	}

	return courses, nil
}

// GetInstructorExams gets assigned exams for instructor
func GetInstructorExams(username string) ([]models.Exam, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	instructorsColl := db.GetCollection("instructors")
	examsColl := db.GetCollection("exams")

	var instructor models.Instructor
	err := instructorsColl.FindOne(ctx, bson.M{"username": username}).Decode(&instructor)
	if err != nil {
		return nil, errors.New("no instructor with the given username exists")
	}

	// Populate assigned exams
	examsCursor, err := examsColl.Find(ctx, bson.M{"_id": bson.M{"$in": instructor.AssignedExams}})
	if err != nil {
		return nil, errors.New("couldn't get instructor's exams")
	}
	defer examsCursor.Close(ctx)

	var exams []models.Exam
	if err := examsCursor.All(ctx, &exams); err != nil {
		return nil, errors.New("couldn't get instructor's exams")
	}

	return exams, nil
}
