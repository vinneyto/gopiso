package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type ModelLister interface {
	ListModels() []*entities.Model
}

func ListModels(lister ModelLister) echo.HandlerFunc {
	return func(c echo.Context) error {

		models := lister.ListModels()

		if models == nil {
			return c.JSON(http.StatusInternalServerError, nil)
		}

		return c.JSON(http.StatusOK, models)
	}
}
