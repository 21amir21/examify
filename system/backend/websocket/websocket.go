package websocket

import (
	"log"

	socketio "github.com/googollee/go-socket.io"
)

func NewSocketServer() *socketio.Server {
	server := socketio.NewServer(nil)

	server.OnConnect("/", func(s socketio.Conn) error {
		log.Println("connected:", s.ID())
		s.Emit("givenSocketID", s.ID())
		return nil
	})

	server.OnEvent("/", "outgoingConnection", func(s socketio.Conn, data map[string]string) {
		toInvigilationSocketID := data["toInvigilationSocketID"]
		username := data["username"]
		fromStudentSocketID := data["fromStudentSocketID"]
		signal := data["signal"]

		server.BroadcastToRoom("/", toInvigilationSocketID, "incomingConnection", map[string]string{
			"signal":          signal,
			"studentSocketID": fromStudentSocketID,
			"username":        username,
		})
	})

	server.OnEvent("/", "acceptIncomingConnection", func(s socketio.Conn, data map[string]string) {
		log.Println("accepted incoming connection!!")
		signal := data["signal"]
		toStudentSocketID := data["toStudentSocketID"]

		server.BroadcastToRoom("/", toStudentSocketID, "connectionAccepted", signal)
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		log.Println("socket error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("disconnected:", reason)
	})

	go server.Serve()

	// TODO: look at it if u want to make the WebSocket server shutdown gracefully
	// // Create a channel to listen for OS termination signals (e.g., Ctrl+C)
	// stopChan := make(chan os.Signal, 1)
	// signal.Notify(stopChan, syscall.SIGINT, syscall.SIGTERM)

	// // Run the server in the background
	// go func() {
	// 	log.Println("Starting WebSocket server...")
	// 	if err := server.Serve(); err != nil {
	// 		log.Println("Error running WebSocket server:", err)
	// 	}
	// }()

	// // Wait for termination signal and then shut down the server gracefully
	// <-stopChan
	// log.Println("Shutting down WebSocket server gracefully...")
	// server.Close()

	return server
}
