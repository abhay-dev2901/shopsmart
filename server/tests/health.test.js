import request from "supertest";
import app from "../src/app.js";

describe("GET /api/health", () => {
  it("should return 200 and status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");

    // Optional stronger checks 👇
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("timestamp");
  });
});