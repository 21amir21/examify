package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Hello World!")

	r := gin.Default()

	r.Run(":8080")

	log.Println("Hello from logger")
}
