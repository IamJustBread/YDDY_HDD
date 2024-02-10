package handlers

import (
	db "YDDY_HDD/internal/database"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func HandleError(c *gin.Context, err error, status int, message string) {
	log.Printf("[%d] %s: %v", status, message, err)
	c.JSON(status, gin.H{"message": message})
}

func ApiHandler(c *gin.Context) {
	switch c.Request.URL.Path {
	case "/api/contenttypes":
		// Processing request to get the list of content types
		contentTypes, err := db.GetContentTypesFromDB()
		if err != nil {
			HandleError(c, err, http.StatusInternalServerError, "Error getting content types from database")
			return
		}

		// Sending the list of content types in JSON format
		c.JSON(http.StatusOK, contentTypes)
	default:
		HandleError(c, nil, http.StatusNotFound, "Not found")
	}
}
