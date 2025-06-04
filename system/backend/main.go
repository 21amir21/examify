package main

import (
	"log"
	"net/http"
	"time"

	"github.com/21amir21/examify/config"
	"github.com/21amir21/examify/db"
	"github.com/21amir21/examify/routes"
	"github.com/21amir21/examify/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	db.ConnectDB()

	// ==== Gin Router (REST APIs) ====
	r := gin.Default()

	// Add CORS middleware for all routes
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.RegisterAuthRoutes(r)
	routes.RegisterStudentRoutes(r)
	routes.RegisterExamRoutes(r)
	routes.RegisterInstructorRoutes(r)
	routes.RegisterInstanceTemplateRoutes(r)

	go func() {
		log.Println("Starting REST server on :8080...")
		if err := r.Run(":8080"); err != nil {
			log.Fatal("REST Server error:", err)
		}
	}()

	// ==== Socket.IO Server (WebSocket) ====
	socketServer := websocket.NewSocketServer()

	wsMux := http.NewServeMux()
	// wsMux.Handle("/", allowCORS(socketServer)) // No need for /invigilation/ anymore unless you want it
	wsMux.Handle("/invigilation/", allowCORS(http.StripPrefix("/invigilation", socketServer)))

	log.Println("Starting WebSocket server on :8081...")
	if err := http.ListenAndServe(":8081", wsMux); err != nil {
		log.Fatal("WebSocket Server error:", err)
	}
}

// CORS middleware for WebSocket server
func allowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			return
		}

		h.ServeHTTP(w, r)
	})
}
