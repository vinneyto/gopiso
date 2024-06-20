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
	models  DataStore[entities.Model]
	rooms   DataStore[entities.Room]
	objects DataStore[entities.Object]
}

func NewTemporary() *Temporary {
	return &Temporary{
		models:  *NewDataStore[entities.Model](),
		rooms:   *NewDataStore[entities.Room](),
		objects: *NewDataStore[entities.Object](),
	}
}

func (t *Temporary) CreateModel(model *entities.Model) *entities.Model {
	t.models.Set(t.models.NextID(), model)
	model.ID = t.models.index
	return t.GetModel(model.ID)
}

func (t *Temporary) GetModel(id int64) *entities.Model {
	return t.models.Get(id)
}

func (t *Temporary) ListModels() []*entities.Model {
	return t.models.List()
}

func (t *Temporary) ListRooms() []*entities.Room {
	return t.rooms.List()
}

func (t *Temporary) GetRoom(id int64) *entities.Room {
	return t.rooms.Get(id)
}

func (t *Temporary) CreateRoom(room *entities.Room) *entities.Room {
	t.rooms.Set(t.rooms.NextID(), room)
	room.ID = t.rooms.index

	for _, object := range room.Objects {
		if object.ID == 0 {
			t.objects.Set(t.objects.NextID(), &object)
			object.ID = t.objects.index
		}
	}

	return t.GetRoom(room.ID)
}

func (t *Temporary) UpdateRoom(id int64, room *entities.Room) *entities.Room {
	if t.rooms.Get(id) == nil {
		return nil
	}
	t.rooms.Set(id, room)
	return room
}

func (t *Temporary) DeleteRoom(id int64) error {
	t.rooms.Delete(id)
	return nil
}
