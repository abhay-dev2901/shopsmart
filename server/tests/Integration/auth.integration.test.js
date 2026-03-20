import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/db.js";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    // Clean up any existing test users before running tests
    console.log("🧹 Cleaning up existing test users...");
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "integration",
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test users
    console.log("🧹 Cleaning test users...");
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "integration",
        },
      },
    });
  });

  it("POST /api/auth/signup - should create a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Integration User",
      email: "integration@test.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("POST /api/auth/login - should return token", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Integration User 2",
      email: "integration2@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "integration2@test.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});