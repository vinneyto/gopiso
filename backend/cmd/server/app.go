package main

import (
	"github.com/vinneyto/gopiso/backend/internal/db"
	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type app struct {
	Repository db.Repository
}

func newApp() (*app, error) {

	Repository := db.NewTemporary()

	Repository.CreateRoom(entities.Room{
		ID:      1,
		Name:    "Room 1",
		Objects: []entities.Object{},
	})

	Repository.CreateRoom(entities.Room{
		ID:      2,
		Name:    "Room 2",
		Objects: []entities.Object{},
	})

	return &app{Repository}, nil
}
