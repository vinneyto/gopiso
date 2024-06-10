package entities

type Model struct {
	ID  int64  `json:"id"`
	Url string `json:"url"`
}

type Object struct {
	ID         int64     `json:"modelId"`
	Position   []int64   `json:"position"`
	Quaternion []float64 `json:"quaternion"`
}

type Room struct {
	ID      int64    `json:"id"`
	Name    string   `json:"name"`
	Objects []Object `json:"objects"`
}
