package main

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"os"
	"time"
)

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

func loadDatabaseConfig() DatabaseConfig {
	return DatabaseConfig{
		User: os.Getenv("DB_USER"),
		Pass: os.Getenv("DB_PASS"),
		Name: os.Getenv("DB_NAME"),
		Host: os.Getenv("DB_HOST"),
	}
}

func handleError(c *gin.Context, err error, status int, message string) {
	fmt.Printf("[%d] %s: %v", status, message, err)
	c.JSON(status, gin.H{"message": message})
}

func handleDBError(c *gin.Context, err error, message string) {
	fmt.Printf("[%d] %s: %v", http.StatusInternalServerError, message, err)

	errorResponse := gin.H{
		"status":  http.StatusInternalServerError,
		"message": message,
	}

	if err != nil {
		errorResponse["error"] = err.Error()
	}

	c.JSON(http.StatusInternalServerError, errorResponse)
}

func initDB(c *gin.Context) {
	config := loadDatabaseConfig()
	dbURI := config.User + ":" + config.Pass + "@tcp(" + config.Host + ")/" + config.Name + "?charset=utf8&parseTime=True"
	var err error
	db, err = sql.Open("mysql", dbURI)
	if err != nil {
		handleDBError(c, err, "Error opening database connection")
		return
	}

	err = db.Ping()
	if err != nil {
		handleDBError(c, err, "Error pinging database")
		return
	}

}

func apiHandler(c *gin.Context) {
	switch c.Request.URL.Path {
	case "/api/contenttypes":
		// Processing request to get the list of content types
		contentTypes, err := getContentTypesFromDB(nil)
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

func getContentTypesFromDB(c *gin.Context) ([]ContentType, error) {
	fmt.Printf("Getting content types from database")
	ctx, cancel := context.WithTimeout(c, 5*time.Second)
	defer cancel()

	rows, err := db.QueryContext(ctx, "SELECT * FROM explosives")
	if err != nil {
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
	initDB(nil)
	fmt.Print("Database connection established")
	port := os.Getenv("PORT")
	if port == "" {
		fmt.Println("$PORT must be set")
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/api/contenttypes", func(c *gin.Context) {
		contentTypes, err := getContentTypesFromDB(nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, APIResponse{Message: "Error getting content types from database"})
			return
		}

		c.JSON(http.StatusOK, APIResponseWithData{Message: "OK", Data: contentTypes})
	})

	router.GET("/api", apiHandler)
	router.GET("/api/calculate", apiHandler)

	log.Fatal(router.Run(":" + port))
}
