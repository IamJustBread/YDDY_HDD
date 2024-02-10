package models

type APIResponse struct {
	Message string `json:"message"`
}

type APIResponseWithData struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type ContentType struct {
	ID              int     `json:"id"`
	SubstanceName   string  `json:"substance_name"`
	Density         float64 `json:"density"`
	DetonationForce float64 `json:"detonation_force"`
	TntEquivalent   float64 `json:"tnt_equivalent"`
}
