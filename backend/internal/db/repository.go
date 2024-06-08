package db

import (
	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type Repository interface {
	ListModels() ([]entities.Model, error)
	ListRooms() ([]entities.Room, error)
	GetRoom(id int) (entities.Room, error)
	CreateRoom(room entities.Room) (entities.Room, error)
	UpdateRoom(id int, room entities.Room) (entities.Room, error)
	DeleteRoom(id int) error
}
