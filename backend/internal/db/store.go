package db

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type Store struct {
	db *gorm.DB
}

func NewStore() *Store {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=disable TimeZone=Asia/Shanghai", user, password, host, port, dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&entities.Model{}, &entities.Room{}, &entities.Object{})
	if err != nil {
		panic(err)
	}

	return &Store{db: db}
}

func (s *Store) CreateModel(model *entities.Model) *entities.Model {
	if err := s.db.Create(model).Error; err != nil {
		return nil
	}
	return model
}

func (s *Store) GetModel(id int64) *entities.Model {
	var model entities.Model
	if err := s.db.First(&model, id).Error; err != nil {
		return nil
	}
	return &model
}

func (s *Store) ListModels() []*entities.Model {
	var models []*entities.Model
	if err := s.db.Find(&models).Error; err != nil {
		return nil
	}
	return models
}

func (s *Store) CreateRoom(room *entities.Room) *entities.Room {
	if err := s.db.Create(room).Error; err != nil {
		return nil
	}
	return room
}

func (s *Store) GetRoom(id int64) *entities.Room {
	var room entities.Room
	if err := s.db.Preload("Objects").First(&room, id).Error; err != nil {
		return nil
	}
	return &room
}

func (s *Store) ListRooms() []*entities.Room {
	var rooms []*entities.Room
	if err := s.db.Preload("Objects").Find(&rooms).Error; err != nil {
		return nil
	}
	return rooms
}

func (s *Store) UpdateRoom(room *entities.Room) *entities.Room {
	if err := s.db.Save(room).Error; err != nil {
		return nil
	}
	return room
}

func (s *Store) DeleteRoom(id int64) bool {
	if err := s.db.Delete(&entities.Room{}, id).Error; err != nil {
		return false
	}
	return true
}
