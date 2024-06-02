package handler

import "github.com/labstack/echo/v4"

func ListRooms() echo.HandlerFunc {

	return func(c echo.Context) error {
		f := Unimplemented()
		return f(c)
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

func DeleteRoom() echo.HandlerFunc {
	type request struct {
		ID int64 `param:"id"`
	}

	return func(c echo.Context) error {
		f := Unimplemented()
		return f(c)
	}
}
