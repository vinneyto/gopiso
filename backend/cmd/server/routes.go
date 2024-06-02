package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/vinneyto/gopiso/backend/internal/handler"
)

func setupRoutes(app *app) *echo.Echo {
	e := echo.New()
	e.HideBanner = true

	e.Use(
		middleware.Recover(),
		middleware.CORS(),
		middleware.LoggerWithConfig(middleware.LoggerConfig{
			Format: `{"time":"${time_unix_milli}", "method":"${method}", "uri":"${uri}", "status":"${status}"}` + "\n",
		}),
	)

	// routes v1
	v1 := e.Group("/api/v1")
	{
		g := v1.Group("/models")
		g.GET("", handler.ListModels())
	}
	{
		g := v1.Group("/rooms")
		g.GET("", handler.ListRooms())
		g.GET("/:id", handler.GetRoom())
		g.POST("/:id", handler.CreateRoom())
		g.PATCH("/:id", handler.UpdateRoom())
		g.DELETE("/:id", handler.DeleteRoom())
	}

	return e
}
