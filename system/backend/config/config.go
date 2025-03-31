package config

import (
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads the environment variables from the .env file
func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		panic("Error load .env file!!")
	}
}

// GetEnv is a function responsible for getting env vars by their keys
func GetEnv(key string) string {
	return os.Getenv(key)
}
