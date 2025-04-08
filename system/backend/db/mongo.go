package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoClient is a global mongo client
var MongoClient *mongo.Client

// ConnectDB is responsible for connecting to MongoDB
func ConnectDB() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI is not set in the environment")
	}

	// Create a new MongoDB client
	clientOptions := options.Client().ApplyURI(mongoURI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Faild to connect to MongoDB: %v", err)
	}

	// Ping the database to check if the connection is alive
	if err = client.Ping(ctx, nil); err != nil {
		log.Fatalf("MongoDB ping faild: %v", err)
	}

	fmt.Println("Connected to MongoDB successfully!")
	MongoClient = client
}

// GetCollection returns a reference to a MongoDB collection
func GetCollection(collectionName string) *mongo.Collection {
	return MongoClient.Database("examifyDB").Collection(collectionName)
}
