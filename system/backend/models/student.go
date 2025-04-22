package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Student represents a student in the system
type Student struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Username        string               `bson:"username" json:"username"`
	Password        string               `bson:"password,omitempty" json:"password"` // Exclude password from JSON responses or hash it
	Name            string               `bson:"name" json:"name"`
	EnrolledCourses []primitive.ObjectID `bson:"enrolledCourses" json:"enrolledCourses"`
	EnrolledExams   []primitive.ObjectID `bson:"enrolledExams" json:"enrolledExams"`
	CurrentExam     CurrentExam          `bson:"currentExam" json:"currentExam"`
}

// CurrentExam wraps the exam reference and the instance assigned to a student
type CurrentExam struct {
	ExamDetails      primitive.ObjectID `bson:"examDetails" json:"examDetails"`
	AssignedInstance AssignedInstance   `bson:"assignedInstance" json:"assignedInstance"`
}

// AssignedInstance represents the instance details assigned to a student for an exam
type AssignedInstance struct {
	InstanceIP       string `bson:"instanceIP" json:"instanceIP"`
	InstancePassword string `bson:"instancePassword" json:"instancePassword"`
}
