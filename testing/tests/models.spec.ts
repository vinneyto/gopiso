import { test, expect } from "@playwright/test";

test.describe("models", () => {
  test("check model creation", async ({ request }) => {
    const url = `http://some-url.${Math.random()}.com`;

    const newModel = await request.post("/api/v1/models", {
      data: {
        url,
      },
    });

    expect(newModel.status()).toBe(200);

    const model = await newModel.json();
    expect(model).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        url,
      })
    );

    const allModels = await request.get("/api/v1/models");
    expect(allModels.ok()).toBeTruthy();

    expect(await allModels.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: model.id,
          url,
        }),
      ])
    );
  });
});
