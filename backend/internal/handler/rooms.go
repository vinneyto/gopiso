package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type RoomLister interface {
	ListRooms() []*entities.Room
}

func ListRooms(lister RoomLister) echo.HandlerFunc {
	return func(c echo.Context) error {
		rooms := lister.ListRooms()
		if rooms == nil {
			c.JSON(http.StatusInternalServerError, nil)
		}
		return c.JSON(http.StatusOK, rooms)
	}
}

type RoomGetter interface {
	GetRoom(id int64) *entities.Room
}

func GetRoom(getter RoomGetter) echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		var req request

		err := c.Bind(&req)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		room := getter.GetRoom(req.ID)

		if room == nil {
			return c.JSON(http.StatusNotFound, nil)
		}

		return c.JSON(http.StatusOK, room)
	}
}

type RoomCreator interface {
	CreateRoom(room *entities.Room) *entities.Room
}

func CreateRoom(creator RoomCreator) echo.HandlerFunc {
	return func(c echo.Context) error {
		var room entities.Room

		err := c.Bind(&room)

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		newRoom := creator.CreateRoom(&room)

		if newRoom == nil {
			return c.JSON(http.StatusInternalServerError, nil)
		}

		return c.JSON(http.StatusOK, newRoom)
	}
}

type RoomUpdater interface {
	UpdateRoom(id int64, room *entities.Room) *entities.Room
}

func UpdateRoom(updater RoomUpdater) echo.HandlerFunc {
	// do we need some RoomUpdateDto which would be a subset of Room?
	type request struct {
		ID      int64             `param:"id"`
		Name    string            `json:"name"`
		Objects []entities.Object `json:"objects"`
	}

	return func(c echo.Context) error {
		var req request

		err := c.Bind(&req)

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		room := &entities.Room{
			ID:      req.ID, // should we use int64 everywhere?
			Name:    req.Name,
			Objects: req.Objects,
		}

		updatedRoom := updater.UpdateRoom(req.ID, room)

		if updatedRoom == nil {
			return c.JSON(http.StatusInternalServerError, nil)
		}

		return c.JSON(http.StatusOK, updatedRoom)
	}
}

type RoomDeleter interface {
	DeleteRoom(id int64) error
}

func DeleteRoom(deleter RoomDeleter) echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		var req request

		err := c.Bind(&req)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		err = deleter.DeleteRoom(req.ID)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, nil)
	}
}
