import request from "supertest";
import app from "../../src/app.js";

describe("Products API", () => {
  it("should respond to /api/products route with valid status", async () => {
    const res = await request(app).get("/api/products");
    // Only check for possible valid statuses
    expect([200, 401, 403]).toContain(res.statusCode);
  });
});