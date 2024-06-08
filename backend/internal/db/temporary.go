package db

import (
	"sync"

	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type DataStore[T any] struct {
	mu   sync.Mutex
	data map[int]T
}

func NewDataStore[T any]() *DataStore[T] {
	return &DataStore[T]{
		data: make(map[int]T),
	}
}

func (ds *DataStore[T]) Set(key int, value T) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	ds.data[key] = value
}

func (ds *DataStore[T]) Get(key int) (T, bool) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	v, ok := ds.data[key]
	return v, ok
}

func (ds *DataStore[T]) Delete(key int) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	delete(ds.data, key)
}

func (ds *DataStore[T]) List() []T {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	values := make([]T, 0, len(ds.data))
	for _, value := range ds.data {
		values = append(values, value)
	}
	return values
}

type NotFoundError struct {
}

func (e *NotFoundError) Error() string {
	return "not found"
}

type Temporary struct {
	Models DataStore[entities.Model]
	Rooms  DataStore[entities.Room]
}

func NewTemporary() *Temporary {
	return &Temporary{
		Models: *NewDataStore[entities.Model](),
		Rooms:  *NewDataStore[entities.Room](),
	}
}

func (t *Temporary) ListModels() ([]entities.Model, error) {
	return t.Models.List(), nil
}

func (t *Temporary) ListRooms() ([]entities.Room, error) {
	return t.Rooms.List(), nil
}

func (t *Temporary) GetRoom(id int) (entities.Room, error) {
	room, ok := t.Rooms.Get(id)
	if !ok {
		return entities.Room{}, &NotFoundError{}
	}
	return room, nil
}

func (t *Temporary) CreateRoom(room entities.Room) (entities.Room, error) {
	t.Rooms.Set(room.ID, room)
	return room, nil
}

func (t *Temporary) UpdateRoom(id int, room entities.Room) (entities.Room, error) {
	_, ok := t.Rooms.Get(id)
	if !ok {
		return entities.Room{}, &NotFoundError{}
	}
	t.Rooms.Set(id, room)
	return room, nil
}

func (t *Temporary) DeleteRoom(id int) error {
	t.Rooms.Delete(id)
	return nil
}
