package db

import (
	"sync"

	"github.com/vinneyto/gopiso/backend/internal/entities"
)

type DataStore[T any] struct {
	mu    sync.Mutex
	data  map[int64]*T
	index int64
}

func NewDataStore[T any]() *DataStore[T] {
	return &DataStore[T]{
		data: make(map[int64]*T),
	}
}

func (ds *DataStore[T]) NextID() int64 {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	ds.index++
	return ds.index
}

func (ds *DataStore[T]) Set(key int64, value *T) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	ds.data[key] = value
}

func (ds *DataStore[T]) Get(key int64) *T {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	return ds.data[key]
}

func (ds *DataStore[T]) Delete(key int64) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	delete(ds.data, key)
}

func (ds *DataStore[T]) List() []*T {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	values := make([]*T, 0, len(ds.data))
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

func (t *Temporary) CreateModel(model *entities.Model) *entities.Model {
	t.Models.Set(t.Models.NextID(), model)
	model.ID = t.Models.index
	return t.GetModel(model.ID)
}

func (t *Temporary) GetModel(id int64) *entities.Model {
	return t.Models.Get(id)
}

func (t *Temporary) ListModels() []*entities.Model {
	return t.Models.List()
}

func (t *Temporary) ListRooms() []*entities.Room {
	return t.Rooms.List()
}

func (t *Temporary) GetRoom(id int64) *entities.Room {
	return t.Rooms.Get(id)
}

func (t *Temporary) CreateRoom(room *entities.Room) *entities.Room {
	t.Rooms.Set(t.Rooms.NextID(), room)
	room.ID = t.Rooms.index
	return t.GetRoom(room.ID)
}

func (t *Temporary) UpdateRoom(id int64, room *entities.Room) *entities.Room {
	if t.Rooms.Get(id) == nil {
		return nil
	}
	t.Rooms.Set(id, room)
	return room
}

func (t *Temporary) DeleteRoom(id int64) error {
	t.Rooms.Delete(id)
	return nil
}
