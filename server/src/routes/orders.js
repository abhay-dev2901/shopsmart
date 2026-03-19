import express from "express";
import prisma from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all orders for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// GET order by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify user owns this order
    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
});

// CREATE order (checkout)
router.post("/checkout", verifyToken, async (req, res) => {
  try {
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and create order items data
    let total = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Create order with items in a transaction
    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId },
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// UPDATE order status
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
});

export default router;
