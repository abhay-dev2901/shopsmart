import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  it("should not allow empty login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});