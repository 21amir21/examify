package controllers

import (
	"context"
	"net/http"
	"strings"

	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"name"` // For registration only
	Role     string `json:"role" binding:"required"`
}

func Login(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Invalid credentials"})
	}

	coll := db.GetCollection(strings.ToLower(req.Role) + "s") // "students" or "instructors"

	var user map[string]any
	err := coll.FindOne(context.TODO(), bson.M{"username": strings.ToLower(req.Username)}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username or password is incorrect"})
		return
	}

	ok := utils.CheckPasswordHash(user["password"].(string), req.Password)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username or password is incorrect"})
		return
	}

	id := user["_id"].(primitive.ObjectID).Hex()
	token, err := utils.GenerateToken(id, req.Username, req.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userId":   id,
		"username": req.Username,
		"token":    token,
		"role":     req.Role,
	})
}

func Register(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Invalid registration data"})
		return
	}

	coll := db.GetCollection(strings.ToLower(req.Role) + "s") // "students" or "instructors"

	// check if user exists
	count, err := coll.CountDocuments(context.TODO(), bson.M{"username": strings.ToLower(req.Username)})
	if err != nil || count > 0 {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Username already exists"})
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	doc := bson.M{
		"username": strings.ToLower(req.Username),
		"password": hashedPassword,
		"name":     req.Name,
	}

	_, err = coll.InsertOne(context.TODO(), doc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Account created successfully"})
}
