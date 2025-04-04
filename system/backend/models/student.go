package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Student represents a student in the system
type Student struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Username        string               `bson:"username" json:"username"`
	Password        string               `bson:"password,omitempty" json:"-"` // Exclude password from JSON responses or hash it
	Name            string               `bson:"name" json:"name"`
	EnrolledCourses []primitive.ObjectID `bson:"enrolledCourses" json:"enrolledCourses"`
	EnrolledExams   []primitive.ObjectID `bson:"enrolledExams" json:"enrolledExams"`
	CurrentExam     Exam                 `bson:"currentExam" json:"currentExam"`
}
