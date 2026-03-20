import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/db.js";

// Mock auth middleware for testing
jest.mock("../../src/middleware/auth.js", () => ({
  verifyToken: (req, res, next) => {
    req.userId = 1;
    next();
  },
}));

describe("Products Integration Tests", () => {
  let testProductId;

  beforeAll(async () => {
    // Create a test product for the integration tests
    const product = await prisma.product.create({
      data: {
        name: "Integration Product",
        price: 99.99,
        category: "electronics",
      },
    });
    testProductId = product.id;
  });

  afterAll(async () => {
    // Clean up products created in this test suite
    await prisma.product.deleteMany({
      where: {
        category: "electronics",
      },
    });
  });

  it("POST /api/products - should create a new product", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test Product for POST",
      price: 49.99,
      category: "test",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test Product for POST");
  });

  it("GET /api/products - should list products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/products/:id - should return product by ID", async () => {
    const res = await request(app).get(`/api/products/${testProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testProductId);
  });

  it("PUT /api/products/:id - should update product", async () => {
    const res = await request(app).put(`/api/products/${testProductId}`).send({
      price: 79.99,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(79.99);
  });

  it("DELETE /api/products/:id - should delete product", async () => {
    const res = await request(app).delete(`/api/products/${testProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });
});