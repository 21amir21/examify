package websocket

import (
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func InitializeServer(httpServer *http.Server) {
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
	defer server.Close()

	// Mount the server at a custom path like "/invigilation"
	http.Handle("/invigilation/", http.StripPrefix("/invigilation", server))

	if err := httpServer.ListenAndServe(); err != nil {
		log.Fatal("WebSocket server failed:", err)
	}
}
