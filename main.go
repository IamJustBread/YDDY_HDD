package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
)

const file string = "resource/yddy_hdd_db.db"

var db *sql.DB

type APIResponse struct {
	Message string `json:"message"`
}

type APIResponseWithData struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type DatabaseConfig struct {
	User string
	Pass string
	Name string
	Host string
}

type ContentType struct {
	ID              int     `json:"id"`
	SubstanceName   string  `json:"substance_name"`
	Density         float64 `json:"density"`
	DetonationForce float64 `json:"detonation_force"`
	TntEquivalent   float64 `json:"tnt_equivalent"`
}

func handleError(c *gin.Context, err error, status int, message string) {
	log.Printf("[%d] %s: %v", status, message, err)
	c.JSON(status, gin.H{"message": message})
}

func handleDBError(c *gin.Context, err error, message string) {
	log.Printf("[%d] %s: %v", http.StatusInternalServerError, message, err)

	errorResponse := gin.H{
		"status":  http.StatusInternalServerError,
		"message": message,
	}

	if err != nil {
		errorResponse["error"] = err.Error()
	}

	c.JSON(http.StatusInternalServerError, errorResponse)
}

func initDB() error {
	DB, err := sql.Open("sqlite3", "./resource/yddy_hdd_db.db")
	if err != nil {
		return err
	}

	db = DB
	return nil
}

func apiHandler(c *gin.Context) {
	switch c.Request.URL.Path {
	case "/api/contenttypes":
		// Processing request to get the list of content types
		contentTypes, err := getContentTypesFromDB()
		if err != nil {
			handleError(c, err, http.StatusInternalServerError, "Error getting content types from database")
			return
		}

		// Sending the list of content types in JSON format
		c.JSON(http.StatusOK, contentTypes)
	default:
		handleError(c, nil, http.StatusNotFound, "Not found")
	}
}

func getContentTypesFromDB() ([]ContentType, error) {
	rows, err := db.Query("SELECT id, substance_name, density, detonation_force, tnt_equivalent FROM explosives")
	if err != nil {
		log.Printf("Error querying database: %v", err)
		return nil, err
	}
	defer rows.Close()

	var contentTypes []ContentType
	for rows.Next() {
		var contentType ContentType
		if err := rows.Scan(&contentType.ID, &contentType.SubstanceName, &contentType.Density, &contentType.DetonationForce, &contentType.TntEquivalent); err != nil {
			return nil, err
		}
		contentTypes = append(contentTypes, contentType)
	}

	return contentTypes, nil
}

func main() {
	initDB()

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/api/contenttypes", func(c *gin.Context) {
		contentTypes, err := getContentTypesFromDB()
		if err != nil {
			c.JSON(http.StatusInternalServerError, APIResponse{Message: "Error getting content types from database"})
			return
		}

		c.JSON(http.StatusOK, APIResponseWithData{Message: "OK", Data: contentTypes})
	})

	router.GET("/api", apiHandler)
	router.GET("/api/calculate", apiHandler)

	log.Fatal(router.Run(":" + "8080"))
}
