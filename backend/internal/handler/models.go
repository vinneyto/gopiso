package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ListModels() echo.HandlerFunc {
	return func(c echo.Context) error {

		return c.JSON(http.StatusNotFound, nil)
	}
}
