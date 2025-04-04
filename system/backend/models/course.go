package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Course represents a course in the system
type Course struct {
	ID                  primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name                string               `bson:"name" json:"name"`
	Code                string               `bson:"code" json:"code"`
	EnrolledStudents    []primitive.ObjectID `bson:"enrolledStudents,omitempty" json:"enrolledStudents,omitempty"`
	EnrolledInstructors []primitive.ObjectID `bson:"enrolledInstructors,omitempty" json:"enrolledInstructors,omitempty"`
}
