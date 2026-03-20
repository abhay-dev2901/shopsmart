import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ShopSmart Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("ShopSmart Backend Service");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

// ✅ ADD test route (for error testing)
app.get("/api/error-test", (req, res) => {
  throw new Error("Test error");
});

// ✅ 404 handler FIRST
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error handler LAST
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

export default app;