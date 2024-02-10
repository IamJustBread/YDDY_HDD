package database

import (
	"YDDY_HDD/internal/models"
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

type ContentType models.ContentType

const file string = "resource/yddy_hdd_db.db"

var db *sql.DB

func InitDB() error {
	DB, err := sql.Open("sqlite3", file)
	if err != nil {
		return err
	}

	db = DB
	return nil
}

func GetContentTypesFromDB() ([]ContentType, error) {
	rows, err := db.Query("SELECT id, substance_name, density, detonation_force, tnt_equivalent FROM explosives")
	if err != nil {
		log.Printf("Error querying database: %v", err)
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Printf("Error closing rows: %v", err)
		}
	}(rows)

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
