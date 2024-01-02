package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"html/template"
	"log"
	"net/http"
	"os"
)

var db *sql.DB

var tpl = template.Must(template.ParseFiles("index.html"))

type APIResponse struct {
	Message string `json:"message"`
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

func handleError(w http.ResponseWriter, err error, status int, message string) {
	log.Printf("[%d] %s: %v", status, message, err)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err = json.NewEncoder(w).Encode(APIResponse{Message: message})
	if err != nil {
		return
	}
}

func initDB() {
	config := loadDatabaseConfig()
	dbURI := config.User + ":" + config.Pass + "@tcp(" + config.Host + ")/" + config.Name + "?charset=utf8&parseTime=True"
	db, err := sql.Open("mysql", dbURI)
	if err != nil {
		handleError(nil, err, http.StatusInternalServerError, "Error connecting to database")
	}
	err = db.Ping()
	if err != nil {
		handleError(nil, err, http.StatusInternalServerError, "Error connecting to database")
	}

	log.Print("Connected to database")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {

	err := tpl.Execute(w, nil)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError, "Error executing template")
	}
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/api/contenttypes":
		// Обработка запроса на получение списка типов содержимого
		contentTypes, err := getContentTypesFromDB()
		if err != nil {
			handleError(w, err, http.StatusInternalServerError, "Error getting content types from database")
			return
		}

		// Отправка списка типов содержимого в формате JSON
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(contentTypes)
		if err != nil {
			handleError(w, err, http.StatusInternalServerError, "Error encoding JSON")
			return
		}
	default:
		handleError(w, nil, http.StatusNotFound, "Not found")
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

func getPort() string {
	port := os.Getenv("PORT")
	if port != "" {
		return fmt.Sprintf(":%s", port)
	}
	return ":3000"
}

func main() {
	initDB()
	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/api", apiHandler)
	mux.HandleFunc("/api/contenttypes", apiHandler)
	mux.HandleFunc("/api/calculate", apiHandler)
	port := getPort()
	log.Fatal(http.ListenAndServe(port, mux))
}
