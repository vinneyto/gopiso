package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func run(ctx context.Context, stdout io.Writer, args []string) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	app, err := newApp()
	if err != nil {
		return fmt.Errorf("error initializing app: %w", err)
	}

	e := setupRoutes(app)

	go func() {
		if err := e.Start(":5173"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			panic(fmt.Errorf("startup panic: %v", err))
		}
	}()

	<-ctx.Done()
	// graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		return fmt.Errorf("failed to shutdown gracefully: %w", err)
	}
	return nil
}

func main() {
	ctx := context.Background()

	if err := run(ctx, os.Stdout, os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}
