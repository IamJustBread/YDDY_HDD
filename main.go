package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"os"
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

func initDB() *sql.DB {
	config := loadDatabaseConfig()
	dbURI := config.User + ":" + config.Pass + "@tcp(" + config.Host + ")/" + config.Name + "?charset=utf8&parseTime=True"
	db, err := sql.Open("mysql", dbURI)
	if err != nil {
		handleDBError(nil, err, "Error opening database connection")
		return nil
	}

	err = db.Ping()
	if err != nil {
		handleDBError(nil, err, "Error pinging database")
		return nil
	}

	log.Print("Connected to database")
	return db
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
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

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

	log.Fatal(router.Run(":" + port))
}
