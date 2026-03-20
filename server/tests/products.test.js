import request from "supertest";
import app from "../src/app.js";

describe("Products API", () => {
  it("should respond to products route", async () => {
    const res = await request(app).get("/api/products");

    expect([200, 401, 403]).toContain(res.statusCode);
  });
});