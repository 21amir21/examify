package services

import (
	"context"
	"errors"

	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/models"
	"go.mongodb.org/mongo-driver/bson"
)

// DoesInstanceTemplateExist checks if an instance template exists by name
func DoesInstanceTemplateExist(name string) (*models.InstanceTemplate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	collection := db.GetCollection("instanceTemplates")

	var template models.InstanceTemplate
	err := collection.FindOne(ctx, bson.M{"name": name}).Decode(&template)
	if err != nil {
		return nil, errors.New("no instance template with the given name exists")
	}

	return &template, nil
}

// GetInstanceTemplates gets all instance templates
func GetInstanceTemplates() ([]models.InstanceTemplate, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	collection := db.GetCollection("instanceTemplates")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, errors.New("couldn't get instance templates")
	}
	defer cursor.Close(ctx)

	var templates []models.InstanceTemplate
	if err := cursor.All(ctx, &templates); err != nil {
		return nil, errors.New("couldn't get instance templates")
	}

	return templates, nil
}
