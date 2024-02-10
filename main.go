package main

import (
	db "YDDY_HDD/internal/database"
	"YDDY_HDD/internal/handlers"
	"YDDY_HDD/internal/middleware"
	"YDDY_HDD/internal/models"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type APIResponse models.APIResponse
type APIResponseWithData models.APIResponseWithData

func main() {
	err := db.InitDB()
	if err != nil {
		return
	}
	port := "8080"

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*")
	router.StaticFile("/favicon.ico", "static/favicon.ico")
	router.Static("/static", "static")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/api/contenttypes", middleware.VerifyRefererMiddleware, func(c *gin.Context) {
		contentTypes, err := db.GetContentTypesFromDB()
		if err != nil {
			c.JSON(http.StatusInternalServerError, APIResponse{Message: "Error getting content types from database"})
			return
		}

		c.JSON(http.StatusOK, APIResponseWithData{Message: "OK", Data: contentTypes})
	})

	router.GET("/api/calculate", handlers.ApiHandler)

	log.Fatal(router.Run(":" + port))
}
