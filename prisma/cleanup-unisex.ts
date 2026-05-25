import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const unisex = await prisma.category.findUnique({ where: { slug: "unisex" } });
  if (unisex) {
    await prisma.category.update({
      where: { id: unisex.id },
      data: { isActive: false },
    });
    console.log(`Deactivated Unisex category (${unisex.id}).`);
  } else {
    console.log("Unisex category not found. Nothing to do.");
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
