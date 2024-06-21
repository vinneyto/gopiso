import { test, expect } from "@playwright/test";

test.describe("rooms", () => {
  test("check room creation", async ({ request }) => {
    const newRoom = await request.post("/api/v1/rooms", {
      data: {
        name: "Room 1",
        objects: [
          {
            modelId: 1,
            position: [1, 2, 3],
            quaternion: [0.1, 0.2, 0.3, 0.4],
          },
          {
            modelId: 2,
            position: [4, 5, 6],
            quaternion: [0.5, 0.6, 0.7, 0.8],
          },
        ],
      },
    });

    expect(newRoom.status()).toBe(200);

    const room = await newRoom.json();
    expect(room).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Room 1",
        objects: [
          {
            modelId: 1,
            position: [1, 2, 3],
            quaternion: [0.1, 0.2, 0.3, 0.4],
          },
          {
            modelId: 2,
            position: [4, 5, 6],
            quaternion: [0.5, 0.6, 0.7, 0.8],
          },
        ],
      })
    );

    const allRooms = await request.get("/api/v1/rooms");
    expect(allRooms.ok()).toBeTruthy();

    expect(await allRooms.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: room.id,
          name: "Room 1",
          objects: [
            {
              modelId: 1,
              position: [1, 2, 3],
              quaternion: [0.1, 0.2, 0.3, 0.4],
            },
            {
              modelId: 2,
              position: [4, 5, 6],
              quaternion: [0.5, 0.6, 0.7, 0.8],
            },
          ],
        }),
      ])
    );
  });

  test("check room deletion", async ({ request }) => {
    const newRoom = await request.post("/api/v1/rooms", {
      data: {
        name: "Room 2",
      },
    });

    expect(newRoom.status()).toBe(200);

    const room = await newRoom.json();
    expect(room).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Room 2",
      })
    );

    const deleteRoom = await request.delete(`/api/v1/rooms/${room.id}`);
    expect(deleteRoom.status()).toBe(200);

    const allRooms = await request.get("/api/v1/rooms");
    expect(allRooms.ok()).toBeTruthy();

    expect(await allRooms.json()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: room.id,
          name: "Room 2",
        }),
      ])
    );
  });
});
