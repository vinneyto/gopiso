package entities

type Model struct {
	ID  int    `json:"id"`
	Url string `json:"url"`
}

type Object struct {
	ID         int       `json:"modelId"`
	Position   []int     `json:"position"`
	Quaternion []float64 `json:"quaternion"`
}

type Room struct {
	ID      int      `json:"id"`
	Name    string   `json:"name"`
	Objects []Object `json:"objects"`
}
