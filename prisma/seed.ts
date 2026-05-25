import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "men" },
      update: {},
      create: {
        nameEn: "Men",
        nameAr: "رجال",
        slug: "men",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBpZjOl0GJJBDdCbdxiJlPmFvWoqVH1sSgXQ1D3xwQYH8oKy0M0x6DzHW3vFgA3p0gFpWkVG_RzCz3TuVJLDi5fZnQrGE6sRE0Nz4Xb3YNNSA2PVQj1JKHy5MWu3UqQ7cXJbDIjEe9VDiNW3J3p8SZxX4a3RUVKBezE5bVNQ2x4JMPYJVqnPxK3xBBkr_AJD02iXVlFZ9T6mN8mZl5XFE7JTHqM3W2MJFIj8RatVs1_VqDRHjawvZmMJRY4LKPkfQ5q8JNp6APEuRyGTjFWMNxzqBKJUBq_GgFIZhA",
      },
    }),
    prisma.category.upsert({
      where: { slug: "women" },
      update: {},
      create: {
        nameEn: "Women",
        nameAr: "نساء",
        slug: "women",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCo97JR2JhGMzOCELFBw0_V4HrCBFdPCMRiuNLCHKUO5P6MZXPVVKR9mfEWAIVY3OUd7fjz4yHKoG4VhJ52r-QJXpOPiXQMuJfzb7l_2nP0C6H67hGSmSEXdtgPX0LxWCHSbGT6LFaRg4Mx0hIhw9iCiLd-JmfGv0_WJvSy4bKYFDOHEt4OkCJbhlGP5jHEVDwb3oBJ3y0TnRXzNV0C7VxfIWj-HyMrNFGfMBaJeV3GQE6bnmMpuJ6Cm0_bJzlCiBE_H73kw-vlyFrN4cxzqFhJwFm_APdqKvhBQ",
      },
    }),
    prisma.category.upsert({
      where: { slug: "kids" },
      update: {},
      create: {
        nameEn: "Kids",
        nameAr: "أطفال",
        slug: "kids",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCFWpZoJCagvbVGUqMOBPo0zj9MF-vCi6ywJ5oKsxU4gDLANDEJBpFQfG6yoCUJBXa7eE14LSPYX3kUFJRFkAKrJcjHF3w_5sMSUHHkw7nIsTv0xMv_E7h7z3n4dUOvX2c_BFiQ6z3Nk03jGiPEINkb0PxuL2eLbQOPkQzDC-FBViwCIMx1GsY8C2yZBqG2FzM-D6dqJOkr5OXI65BKnLqFJpGPnQkZnNbRHGfSfX1sKEBNqEqFy3Gv_eEYW9pbbS43uQdlv3B5bBRMV4hAOG8S48LZLN2MBwJA",
      },
    }),
  ]);

  const [menCat, womenCat, kidsCat] = categories;
  console.log("✓ Categories seeded");

  // ── Sizes ───────────────────────────────────────────────────────────────────
  const sizes = await Promise.all(
    ["S", "M", "L", "XL", "One Size"].map((label) =>
      prisma.size.upsert({
        where: { label },
        update: {},
        create: { label },
      })
    )
  );
  const [sizeS, sizeM, sizeL, sizeXL, sizeOneSize] = sizes;
  console.log("✓ Sizes seeded");

  // ── Colors ──────────────────────────────────────────────────────────────────
  const colors = await Promise.all([
    prisma.color.upsert({
      where: { id: "color-white" },
      update: {},
      create: { id: "color-white", nameEn: "White", nameAr: "أبيض", hex: "#FFFFFF" },
    }),
    prisma.color.upsert({
      where: { id: "color-black" },
      update: {},
      create: { id: "color-black", nameEn: "Black", nameAr: "أسود", hex: "#000000" },
    }),
    prisma.color.upsert({
      where: { id: "color-yellow" },
      update: {},
      create: { id: "color-yellow", nameEn: "Yellow", nameAr: "أصفر", hex: "#F8E600" },
    }),
    prisma.color.upsert({
      where: { id: "color-blue" },
      update: {},
      create: { id: "color-blue", nameEn: "Blue", nameAr: "أزرق", hex: "#0066EE" },
    }),
    prisma.color.upsert({
      where: { id: "color-pink" },
      update: {},
      create: { id: "color-pink", nameEn: "Pink", nameAr: "وردي", hex: "#FF69B4" },
    }),
    prisma.color.upsert({
      where: { id: "color-green" },
      update: {},
      create: { id: "color-green", nameEn: "Green", nameAr: "أخضر", hex: "#22C55E" },
    }),
  ]);
  const [colorWhite, colorBlack, colorYellow, colorBlue] = colors;
  console.log("✓ Colors seeded");

  // ── Tags ────────────────────────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { nameEn: "New Arrival" },
      update: {},
      create: { nameEn: "New Arrival", nameAr: "وصل حديثاً" },
    }),
    prisma.tag.upsert({
      where: { nameEn: "Best Seller" },
      update: {},
      create: { nameEn: "Best Seller", nameAr: "الأكثر مبيعاً" },
    }),
    prisma.tag.upsert({
      where: { nameEn: "Limited Edition" },
      update: {},
      create: { nameEn: "Limited Edition", nameAr: "إصدار محدود" },
    }),
    prisma.tag.upsert({
      where: { nameEn: "Gifting" },
      update: {},
      create: { nameEn: "Gifting", nameAr: "هدايا" },
    }),
    prisma.tag.upsert({
      where: { nameEn: "Casual" },
      update: {},
      create: { nameEn: "Casual", nameAr: "كاجوال" },
    }),
  ]);
  const [tagNewArrival, tagBestSeller, tagLimitedEdition, tagGifting, tagCasual] = tags;
  console.log("✓ Tags seeded");

  // ── Products ─────────────────────────────────────────────────────────────────
  const products = [
    {
      nameEn: "Donn Baby Sock",
      nameAr: "جوارب دون بيبي",
      descriptionEn: "Soft and playful baby socks designed for comfort and fun.",
      descriptionAr: "جوارب أطفال ناعمة ومرحة مصممة للراحة والمتعة.",
      slug: "donn-baby-sock",
      categoryId: kidsCat.id,
      isFeatured: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBI3uU5DxXDuFiM2X3-wH7SZpKBs7ZBJNqyIz8DXVlkwJ_K8TBvDAY9hcTDOy-RBBqe5rUBwakR1VQZzPJZ8JB1n8xrF8_BIQVJ6ik3Oo3TJNp5xaxS9xT7LFWqE_5oQbKJBTGE1CXIhp0_J2Pt2P5kpiqEfuWQJo37Q7Z1E8Md8E4-beMpAbbGD2kRh6BVBA56ooFLZAfxhXBjCERTauvL4tqkmNx6sLJ_mXwE5M5wKfN0KMmjuKCjEIZopxC4V9mYnMWfC1h3_-BG5_M3hXfm2SKBwLFa87Mq_g",
      price: 23,
      sizes: [sizeS, sizeM, sizeOneSize],
      colors: [colorWhite, colorYellow],
      tags: [tagNewArrival, tagCasual],
    },
    {
      nameEn: "Doha Bawl Sock",
      nameAr: "جوارب دوحة بول",
      descriptionEn: "Bold and expressive socks that speak your style.",
      descriptionAr: "جوارب جريئة ومعبرة تعكس أسلوبك الشخصي.",
      slug: "doha-bawl-sock",
      categoryId: menCat.id,
      isFeatured: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDh2E_sTqE2GDPMiMPidF5L9OvnK5eaBPqZq-Y8A7E2I9VjJZV42f1C7v94rDdC5_WrFBrHBGJQwHNq5C7HFmYEPlmHfZ1b94Y_i2PInS0TrY1C5Xb-C9mmqf0K5RhtYDy3MxhXwLI2d8L4Xm65V2bQFxvNXzf0dBfRJXGkRcN7yHvxcUzFm3L_1RHbH_8rVY2hZ7nKqEk3m9Q_-6l6YWjAOL-UaAixIVbzz_K6Cp4vCdNGvC_sVCwDJKXFjWkS-UHRq5ICBgEk4IgGCT8K-BI_iqHGPkzK4pCA",
      price: 25,
      sizes: [sizeM, sizeL, sizeXL],
      colors: [colorBlue, colorBlack],
      tags: [tagNewArrival, tagLimitedEdition],
    },
    {
      nameEn: "Doha Onen Sock",
      nameAr: "جوارب دوحة أونن",
      descriptionEn: "Clean and minimal design for the everyday look.",
      descriptionAr: "تصميم نظيف ومبسط للمظهر اليومي.",
      slug: "doha-onen-sock",
      categoryId: menCat.id,
      isFeatured: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEMhSGNjVHmjqS4Z_LBdGgOHj4zz28CatCNqIEjKzXsqLEdSVpyYeOWAXGqjagXJxUjI4tpwBEP1LvAqWJ0lsFHlVH8BuwM7xALHbZkiPlTAMFJgkRHjSe7lx3eLdnHzBWijQzuV0rRrBY1e0P3JkiVJFEhDvMkiMibr0oJbfqVfb0LKCqwn8G__hJsFHFlN-2ILgOFhHsv1z25VbMb_DcfKEpzPd_lP8lVqaxfG4iWRrLVi4_2ioIJLRoloJbv8F_EEIEDxnF-XNJfWL2cAQFNaHNzYJsqGr9Q",
      price: 23,
      sizes: [sizeS, sizeM, sizeL],
      colors: [colorWhite, colorBlack],
      tags: [tagNewArrival, tagCasual],
    },
    {
      nameEn: "Ehdiy Dona Sock",
      nameAr: "جوارب إهدي دونا",
      descriptionEn: "A gift-worthy sock with vibrant patterns and premium quality.",
      descriptionAr: "جوارب تستحق أن تُهدى بأنماط زاهية وجودة عالية.",
      slug: "ehdiy-dona-sock",
      categoryId: womenCat.id,
      isFeatured: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCVB7E7Qlz6X1Rf_9YDXJMt5dHFi1M4nVhp8CJoRuoxf1mwl0oH9Nd5H_e1y4K7FqkzBYWlGfF2LDdUlNHUX8Y6wkNGWZZ-3Ei8AvJD8JHv9mU8pLvvWBnxJBVGz2_xKC6UZoAhLOlHBsC_w0eC5tUPR7OKYfOB0GKCLuvFkNtfYuPBuUO4vWYnuZ-yK9zY0j5GxzNIuZ3VLk1CIOQXWA4n2uKkSiuDgmO4_FZFU5NQz2I-X1-6ORW_a2E7iuHdXQ-2lS-8rFVkA3_J4XKgNwPCaIbQP-73OcA",
      price: 25,
      sizes: [sizeS, sizeM, sizeL],
      colors: [colorYellow, colorBlue],
      tags: [tagNewArrival, tagGifting],
    },
    {
      nameEn: "Fiwstment Sock",
      nameAr: "جوارب فيوستمنت",
      descriptionEn: "Statement socks for the bold at heart.",
      descriptionAr: "جوارب لافتة للنظر تناسب الشخصيات الجريئة.",
      slug: "fiwstment-sock",
      categoryId: menCat.id,
      isFeatured: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQyDFO5-VjhtFBqt_VQz7NrO2H4sxWXxhGT0LnR_4TMk82lJ5WBqQ3GmLlHiZzHzS-7zOI0wZhN_PnIQfVVKizVQKCZP9C1L7DhIb5qGJIBfpZ0QmWpPCLqFJidV4jIJEMqikGQ0e3ILZ0-O3RWYyHt2SHzH5S9N7IzLGKoUWjVR5PsM-SMxZ0ZSbVzBnAM4C_T55eUh1mvHYkW8H1-vYFaevXjBMFuqr3_Ev79iH2kLScj5-0NsX4gNmpnBKO6xGHJ6IcUGFnq7Jl0OHFrQMSJ48m_-i4Y_gA",
      price: 25,
      sizes: [sizeM, sizeL, sizeXL],
      colors: [colorBlack, colorBlue],
      tags: [tagCasual],
    },
    {
      nameEn: "Firashment Sock",
      nameAr: "جوارب فيراشمنت",
      descriptionEn: "Comfortable everyday socks with a modern twist.",
      descriptionAr: "جوارب مريحة يومية بلمسة عصرية.",
      slug: "firashment-sock",
      categoryId: menCat.id,
      isFeatured: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBi-dJTLF2TeSXPgn8yPCX0OQJFJ5vKJOPGQFjbKX0J3ARG2Nb8_jAnxe08C7Io3XZPM9NMjC_JYJNSUGGBb_i3XfFe7kEuVxLLxBQ7IwYiWNk1m5J_Vb1VKS_-nFNEm",
      price: 25,
      sizes: [sizeM, sizeL, sizeXL],
      colors: [colorWhite, colorYellow],
      tags: [tagCasual],
    },
    {
      nameEn: "Memming Sock",
      nameAr: "جوارب ميمينج",
      descriptionEn: "Playful patterns for the fun-loving soul.",
      descriptionAr: "أنماط مرحة تناسب الروح المحبة للمتعة.",
      slug: "memming-sock",
      categoryId: menCat.id,
      isFeatured: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfVMVqVv4JJdJmS8sFCdIFlz_oRt17wtyORvNlHVFi_CujMEG7bZE7JM8a7sHp4aO4S56OBiJjsK8V_B4-Z0n6fXVvbDDvpDz_1k0UGS9gT0w5KHKH7oDM8V1CjHF-3yL",
      price: 25,
      sizes: [sizeS, sizeM, sizeL],
      colors: [colorBlue, colorYellow],
      tags: [tagCasual, tagLimitedEdition],
    },
    {
      nameEn: "Fiomhment Sock",
      nameAr: "جوارب فيومنت",
      descriptionEn: "Premium cotton blend with vibrant colors.",
      descriptionAr: "خليط قطن فاخر بألوان زاهية.",
      slug: "fiomhment-sock",
      categoryId: menCat.id,
      isFeatured: false,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDuqxm5OEp-K4F4tCIqT0YnCvnpS7oEb6iLH5m_4X7GnY_7pUAUJP7S2bz3B7bV5V_0UbEi-3E-5Mv4F6x63VWXeDjA3vhMGPEg3lNlJePLcRHAXB7e1fDzMbwF5IeXBQ",
      price: 25,
      sizes: [sizeM, sizeL, sizeXL],
      colors: [colorBlack, colorWhite],
      tags: [tagCasual],
    },
    {
      nameEn: "Hamen Sock",
      nameAr: "جوارب هامن",
      descriptionEn: "Best-selling comfort sock loved by all.",
      descriptionAr: "جوارب مريحة الأكثر مبيعاً يحبها الجميع.",
      slug: "hamen-sock",
      categoryId: menCat.id,
      isFeatured: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlb_AUOGaJpNcPJtEhz1fzEW7Xzm3rNuV4g1DkmLs7yiYG6oVxHmWgMjKqXDvxjmz5ILmIXUPEA3OknFM0lfEz1WnoZLO5qLdlEA1H0yqSnNqbpNnkESTnFi3s6rJjEr3eM8nzSUPiVSBjxA0yUWN1kSZaXqKQQ_RxlYq3OvD0qJLy6C8eW9TN6ByrJEBwLu0I7T9VVi2-CXqI5YoikCuWBhAKZy3sOnDOl6UElJuF1pVrv9JxfYwKHGsEULb8pjnS1U9nf2Rm0",
      price: 25,
      sizes: [sizeM, sizeL, sizeXL],
      colors: [colorBlack, colorBlue, colorYellow],
      tags: [tagBestSeller, tagCasual],
    },
    {
      nameEn: "Vano Sock",
      nameAr: "جوارب فانو",
      descriptionEn: "Stylish and vibrant — the sock that started it all.",
      descriptionAr: "أنيق ومفعم بالحيوية — الجوارب التي بدأت منها كل شيء.",
      slug: "vano-sock",
      categoryId: womenCat.id,
      isFeatured: true,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wR_S7EsRAscL6tPqEVJBw-I82xHoR0kUGkFpJkXnwqjNJuGsIzQzFsG3hM3QAEo0E-iRiJhpORXHEGhEAfkuZ_mDiVmLklp5X40IKiFd2dYHJX3rONvAqJNEBLFrmG8CZSI1Aw1m8AQIA_e7IYXzuJjHd4-f6Hn2-fBbF3OU3OvNqNL_NTf5QaHLJvVLxp5t7rPCYBUd1Xu3R1ZXf7pkJQV_K9bCm4pXIiRhqq-dXi0H7BXqRQCIeVFBjcHidnYl6xjU2c5Nfh",
      price: 25,
      sizes: [sizeS, sizeM, sizeL],
      colors: [colorYellow, colorBlue, colorWhite],
      tags: [tagBestSeller, tagGifting],
    },
  ];

  for (const p of products) {
    const { sizes: prodSizes, colors: prodColors, tags: prodTags, image, price, ...rest } = p;

    const product = await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: rest,
    });

    // Primary image
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id, isPrimary: true },
    });
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: image,
          altEn: rest.nameEn,
          altAr: rest.nameAr,
          isPrimary: true,
          position: 0,
        },
      });
    }

    // Variants: one per (size, color) combo
    for (const size of prodSizes) {
      for (const color of prodColors) {
        const sku = `${rest.slug.toUpperCase().replace(/-/g, "")}-${size.label}-${color.hex.replace("#", "")}`;
        await prisma.variant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            sizeId: size.id,
            colorId: color.id,
            price,
            stock: Math.floor(Math.random() * 30) + 5,
            sku,
          },
        });
      }
    }

    // Tags
    for (const tag of prodTags) {
      await prisma.productTag.upsert({
        where: { productId_tagId: { productId: product.id, tagId: tag.id } },
        update: {},
        create: { productId: product.id, tagId: tag.id },
      });
    }
  }
  console.log("✓ Products seeded");

  // ── Users ───────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@Jelly2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@jellysocks.com" },
    update: {},
    create: {
      email: "admin@jellysocks.com",
      password: adminHash,
      role: "ADMIN",
      profile: {
        create: {
          firstName: "Jelly",
          lastName: "Admin",
          country: "Egypt",
        },
      },
    },
  });

  const customerHash = await bcrypt.hash("Customer@Jelly2024!", 12);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerHash,
      role: "CUSTOMER",
      profile: {
        create: {
          firstName: "Test",
          lastName: "Customer",
          country: "Egypt",
        },
      },
    },
  });
  console.log("✓ Users seeded");

  // ── Coupon ──────────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "JELLY10" },
    update: {},
    create: {
      code: "JELLY10",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 50,
      maxUses: 100,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME20" },
    update: {},
    create: {
      code: "WELCOME20",
      type: "FIXED",
      value: 20,
      minOrder: 75,
      maxUses: 50,
      isActive: true,
    },
  });
  console.log("✓ Coupons seeded");

  // ── Banners ─────────────────────────────────────────────────────────────────
  await prisma.banner.upsert({
    where: { id: "banner-hero-1" },
    update: {},
    create: {
      id: "banner-hero-1",
      titleEn: "Socks that make you smile",
      titleAr: "جوارب تجعلك تبتسم",
      subtitleEn: "New arrivals every week. Shop the collection.",
      subtitleAr: "وصولات جديدة كل أسبوع. تسوق المجموعة.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlb_AUOGaJpNcPJtEhz1fzEW7Xzm3rNuV4g1DkmLs7yiYG6oVxHmWgMjKqXDvxjmz5ILmIXUPEA3OknFM0lfEz1WnoZLO5qLdlEA1H0yqSnNqbpNnkESTnFi3s6rJjEr3eM8nzSUPiVSBjxA0yUWN1kSZaXqKQQ_RxlYq3OvD0qJLy6C8eW9TN6ByrJEBwLu0I7T9VVi2-CXqI5YoikCuWBhAKZy3sOnDOl6UElJuF1pVrv9JxfYwKHGsEULb8pjnS1U9nf2Rm0",
      linkUrl: "/en",
      isActive: true,
      position: 0,
    },
  });

  await prisma.banner.upsert({
    where: { id: "banner-sale-1" },
    update: {},
    create: {
      id: "banner-sale-1",
      titleEn: "Free Shipping on Orders $75+",
      titleAr: "شحن مجاني للطلبات فوق ٧٥ دولار",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wR_S7EsRAscL6tPqEVJBw-I82xHoR0kUGkFpJkXnwqjNJuGsIzQzFsG3hM3QAEo0E-iRiJhpORXHEGhEAfkuZ_mDiVmLklp5X40IKiFd2dYHJX3rONvAqJNEBLFrmG8CZSI1Aw1m8AQIA_e7IYXzuJjHd4-f6Hn2-fBbF3OU3OvNqNL_NTf5QaHLJvVLxp5t7rPCYBUd1Xu3R1ZXf7pkJQV_K9bCm4pXIiRhqq-dXi0H7BXqRQCIeVFBjcHidnYl6xjU2c5Nfh",
      isActive: true,
      position: 1,
    },
  });
  console.log("✓ Banners seeded");

  console.log("\n✅ Seed complete.");
  console.log(`   Admin:    admin@jellysocks.com`);
  console.log(`   Customer: customer@example.com`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
