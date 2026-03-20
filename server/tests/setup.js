import prisma from "../src/db.js";

beforeAll(async () => {
  try {
    console.log("🔄 Initializing test environment...");
    
    // Verify database connection by querying a table
    await prisma.user.count();
    console.log("✅ Database connection verified");
    
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error("Error details:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Clean up all data after all tests complete
    console.log("🧹 Final cleanup...");
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    
    await prisma.$disconnect();
    console.log("✅ Test environment cleaned up");
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
  }
});