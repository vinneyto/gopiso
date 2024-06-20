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

type ModelCreator interface {
	CreateModel(model *entities.Model) *entities.Model
}

func CreateModel(creator ModelCreator) echo.HandlerFunc {
	return func(c echo.Context) error {
		var model entities.Model

		err := c.Bind(&model)

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		newModel := creator.CreateModel(&model)

		if newModel == nil {
			return c.JSON(http.StatusInternalServerError, "failed to create model")
		}

		return c.JSON(http.StatusOK, newModel)
	}
}
