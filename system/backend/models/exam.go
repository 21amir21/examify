package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Exam represents an exam in the system
type Exam struct {
	ID                   primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name                 string               `bson:"name" json:"name"`
	CourseName           string               `bson:"courseName" json:"courseName"`
	Duration             int                  `bson:"duration" json:"duration"`
	StartDateTime        string               `bson:"startDateTime" json:"startDateTime"`
	EnrolledStudents     []primitive.ObjectID `bson:"enrolledStudents" json:"enrolledStudents"`
	CreatedBy            primitive.ObjectID   `bson:"createdBy" json:"createdBy"`
	InstanceTemplate     InstanceTemplate     `bson:"instanceTemplate" json:"instanceTemplate"`
	InvigilationInstance InvigilationInstance `bson:"invigilationInstance" json:"invigilationInstance"`
	VPCID                string               `bson:"vpcID,omitempty" json:"-"`
	SGID                 string               `bson:"sgID,omitempty" json:"-"`
}

// InvigilationInstance represents the invigilation server details
type InvigilationInstance struct {
	InstanceIP       string `bson:"instanceIP" json:"instanceIP"`
	SocketID         string `bson:"socketID" json:"socketID"`
	InstancePassword string `bson:"instancePassword" json:"instancePassword"`
}
