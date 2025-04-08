package utils

import (
	"errors"
	"time"

	"github.com/21amir21/examify/config"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID string, username string, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID":   userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(2 * time.Hour).Unix(),
	})

	return token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
}

func VerfiyToken(token string) (int64, error) {
	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
		_, ok := t.Method.(*jwt.SigningMethodHMAC)

		if !ok {
			return nil, errors.New("unexpected signing method")
		}

		return []byte(config.GetEnv("JWT_SECRET")), nil
	})

	if err != nil {
		return 0, errors.New("could not parse token")
	}

	tokenIsValid := parsedToken.Valid

	if !tokenIsValid {
		return 0, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok {
		return 0, errors.New("invalid token claims")
	}

	userID, ok := claims["userID"].(float64) // JWT typically encodes numbers as float64

	if !ok {
		return 0, errors.New("userID is missing or not a valid number")
	}

	return int64(userID), nil
}
