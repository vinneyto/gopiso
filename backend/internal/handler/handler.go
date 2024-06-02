package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Unimplemented() echo.HandlerFunc {
	return func(c echo.Context) error {

		return c.JSON(http.StatusNotImplemented, nil)
	}
}
