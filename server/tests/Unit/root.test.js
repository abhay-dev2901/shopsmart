import request from "supertest";
import app from "../../src/app.js";

describe("Root Route", () => {
  it("should return welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("ShopSmart Backend Service");
  });
});