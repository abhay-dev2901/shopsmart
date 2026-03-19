import "dotenv/config";
import app from "./app.js";
import prisma from "./db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✓ Database connected");

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
