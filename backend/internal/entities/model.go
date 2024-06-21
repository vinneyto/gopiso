package entities

import (
	"github.com/lib/pq"
)

type Model struct {
	ID  int64  `json:"id"`
	Url string `json:"url"`
}

type Object struct {
	ID         int64           `json:"modelId"`
	Position   pq.Float32Array `json:"position" gorm:"type:real[]"`
	Quaternion pq.Float32Array `json:"quaternion" gorm:"type:real[]"`
	RoomID     int64           `json:"-"`
}

type Room struct {
	ID      int64     `json:"id"`
	Name    string    `json:"name"`
	Objects []*Object `json:"objects" gorm:"foreignKey:RoomID"`
}
