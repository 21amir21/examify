package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Instructor represents an instructor in the system
type Instructor struct {
	ID              primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Username        string               `bson:"username" json:"username"`
	Password        string               `bson:"password,omitempty" json:"password"` // Omit password from JSON response or hash it
	Name            string               `bson:"name" json:"name"`
	AssignedCourses []primitive.ObjectID `bson:"assignedCourses,omitempty" json:"assignedCourses,omitempty"`
	AssignedExams   []primitive.ObjectID `bson:"assignedExams,omitempty" json:"assignedExams,omitempty"`
}
