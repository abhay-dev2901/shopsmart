import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log("🔄 Setting up test database...");
    
    // Test the connection
    await prisma.user.count();
    console.log("✅ Database connected successfully");
    
    // Clear all tables
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    
    console.log("✅ Database tables cleared");
    
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
