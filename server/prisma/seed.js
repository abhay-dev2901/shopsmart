import prisma from "../src/db.js";

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        stock: 50,
        category: "Electronics",
        image: "https://via.placeholder.com/300x300?text=Wireless+Headphones",
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt",
        price: 29.99,
        stock: 100,
        category: "Clothing",
        image: "https://via.placeholder.com/300x300?text=T-Shirt",
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with good grip",
        price: 89.99,
        stock: 75,
        category: "Footwear",
        image: "https://via.placeholder.com/300x300?text=Running+Shoes",
      },
      {
        name: "Phone Case",
        description: "Durable phone case with drop protection",
        price: 19.99,
        stock: 200,
        category: "Accessories",
        image: "https://via.placeholder.com/300x300?text=Phone+Case",
      },
      {
        name: "USB-C Cable",
        description: "Fast charging USB-C cable (2m)",
        price: 14.99,
        stock: 150,
        category: "Electronics",
        image: "https://via.placeholder.com/300x300?text=USB-C+Cable",
      },
      {
        name: "Water Bottle",
        description: "Insulated water bottle, keeps drinks hot/cold for 24 hours",
        price: 34.99,
        stock: 80,
        category: "Accessories",
        image: "https://via.placeholder.com/300x300?text=Water+Bottle",
      },
    ],
  });

  console.log(`✓ Created ${products.count} products`);
  console.log("✓ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("✗ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
