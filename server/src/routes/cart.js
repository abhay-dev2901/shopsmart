import express from "express";
import prisma from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET cart items for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: {
        product: true,
      },
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

// ADD item to cart
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.userId,
          productId: parseInt(productId),
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: { product: true },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.userId,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
        include: { product: true },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

// UPDATE cart item quantity
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: { quantity: parseInt(quantity) },
      include: { product: true },
    });

    res.json(cartItem);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
});

// REMOVE item from cart
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(500).json({ message: "Error removing from cart", error: error.message });
  }
});

// CLEAR cart
router.delete("/", verifyToken, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
});

export default router;
