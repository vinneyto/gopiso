package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/vinneyto/gopiso/backend/internal/db"
)

func ListModels(db db.Repository) echo.HandlerFunc {
	return func(c echo.Context) error {

		models, err := db.ListModels()

		if err != nil {
			return c.JSON(http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, models)
	}
}
