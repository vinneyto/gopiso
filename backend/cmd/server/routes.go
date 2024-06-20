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
		g.GET("", handler.ListModels(app.Repository))
		g.POST("", handler.CreateModel(app.Repository))
	}
	{
		g := v1.Group("/rooms")
		g.GET("", handler.ListRooms(app.Repository))
		g.POST("", handler.CreateRoom(app.Repository))
		g.GET("/:id", handler.GetRoom(app.Repository))
		g.PATCH("/:id", handler.UpdateRoom(app.Repository))
		g.DELETE("/:id", handler.DeleteRoom(app.Repository))
	}

	return e
}
