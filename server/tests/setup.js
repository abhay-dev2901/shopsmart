import prisma from "../src/db.js";

beforeAll(async () => {
  // Clean tables before all tests start
  await prisma.cartItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});