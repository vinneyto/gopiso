package main

import (
	"github.com/vinneyto/gopiso/backend/internal/db"
	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type app struct {
	Repository *db.Temporary
}

func newApp() (*app, error) {

	Repository := db.NewTemporary()

	Repository.CreateModel(&entities.Model{
		Url: "https://example.com/model1",
	})

	Repository.CreateModel(&entities.Model{
		Url: "https://example.com/model2",
	})

	Repository.CreateRoom(&entities.Room{
		Name:    "Room 1",
		Objects: []entities.Object{},
	})

	Repository.CreateRoom(&entities.Room{
		Name:    "Room 2",
		Objects: []entities.Object{},
	})

	return &app{Repository}, nil
}
