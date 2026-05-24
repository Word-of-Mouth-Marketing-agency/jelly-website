import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function verify() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const [productCount, userCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.category.count(),
  ]);

  const products = await prisma.product.findMany({ select: { nameEn: true }, take: 3 });
  const users = await prisma.user.findMany({ select: { email: true, role: true } });

  console.log(`✓ Products: ${productCount} | Users: ${userCount} | Categories: ${categoryCount}`);
  console.log(`✓ Sample products: ${products.map((p) => p.nameEn).join(", ")}`);
  console.log(`✓ Users: ${users.map((u) => `${u.email} (${u.role})`).join(", ")}`);

  await prisma.$disconnect();
}

verify().catch((e) => { console.error(e); process.exit(1); });
