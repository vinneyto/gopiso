package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/vinneyto/gopiso/backend/internal/db"
)

func ListRooms(db db.Repository) echo.HandlerFunc {
	return func(c echo.Context) error {
		rooms, err := db.ListRooms()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}
		return c.JSON(http.StatusOK, rooms)
	}
}

func GetRoom() echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		f := Unimplemented()
		return f(c)
	}
}

func CreateRoom() echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		f := Unimplemented()
		return f(c)
	}
}

func UpdateRoom() echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		f := Unimplemented()
		return f(c)
	}
}

func DeleteRoom(db db.Repository) echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		userIdStr := c.Param("id")
		userId, err := strconv.Atoi(userIdStr)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		err = db.DeleteRoom(userId)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, nil)
	}
}
