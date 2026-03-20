import request from "supertest";
import app from "../../src/app.js";

describe("Error Handler", () => {
  it("should return 500 on server error", async () => {
    const res = await request(app).get("/api/error-test");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });
});