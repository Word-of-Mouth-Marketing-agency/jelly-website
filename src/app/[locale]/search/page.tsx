import { auth } from "@/auth";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import {
  getCatalogFilterOptions,
  getWishlistProductIds,
  searchProducts,
  type ProductSearchFilters,
} from "@/lib/products";
import type { Metadata } from "next";
import { ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Search - Jelly",
  description: "Search Jelly socks by style, category, color, size, and price.",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numberParam(value: string | string[] | undefined) {
  const raw = firstParam(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function sortParam(value: string | string[] | undefined) {
  const raw = firstParam(value);
  if (
    raw === "price-low" ||
    raw === "price-high" ||
    raw === "name" ||
    raw === "newest"
  ) {
    return raw;
  }
  return "newest";
}

function parseFilters(searchParams: SearchParams): ProductSearchFilters {
  return {
    q: firstParam(searchParams.q),
    category: firstParam(searchParams.category),
    color: firstParam(searchParams.color),
    size: firstParam(searchParams.size),
    minPrice: numberParam(searchParams.minPrice),
    maxPrice: numberParam(searchParams.maxPrice),
    sort: sortParam(searchParams.sort),
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  const filters = parseFilters(rawSearchParams);
  const session = await auth();

  const [products, options, wishlistIds] = await Promise.all([
    searchProducts(filters),
    getCatalogFilterOptions(),
    getWishlistProductIds(session?.user?.id),
  ]);

  const isRtl = locale === "ar";
  const query = filters.q?.trim() ?? "";
  const title = query ? `Search results for "${query}"` : "Search Jelly";

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <nav
            className="text-sm text-on-surface-variant mb-4 flex items-center gap-1.5"
            aria-label="breadcrumb"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={16} strokeWidth={2.25} aria-hidden="true" />
            <span className="text-on-surface font-medium">Search</span>
          </nav>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            {title}
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-12">
        <form
          action={`/${locale}/search`}
          className="bg-white rounded-2xl sticker-border p-5 mb-10 grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <label className="md:col-span-2">
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Search
            </span>
            <input
              name="q"
              defaultValue={query}
              placeholder="Color, style, category..."
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
            />
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Category
            </span>
            <select
              name="category"
              defaultValue={filters.category ?? ""}
              className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none"
            >
              <option value="">All</option>
              {options.categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {isRtl ? category.nameAr : category.nameEn}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Color
            </span>
            <select
              name="color"
              defaultValue={filters.color ?? ""}
              className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none"
            >
              <option value="">All</option>
              {options.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {isRtl ? color.nameAr : color.nameEn}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Size
            </span>
            <select
              name="size"
              defaultValue={filters.size ?? ""}
              className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none"
            >
              <option value="">All</option>
              {options.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Sort
            </span>
            <select
              name="sort"
              defaultValue={filters.sort ?? "newest"}
              className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: low</option>
              <option value="price-high">Price: high</option>
              <option value="name">Name</option>
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Min price
            </span>
            <input
              name="minPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={filters.minPrice ?? ""}
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
            />
          </label>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              Max price
            </span>
            <input
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={filters.maxPrice ?? ""}
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
            />
          </label>

          <div className="md:col-span-4 flex flex-wrap items-end gap-3">
            <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all">
              Apply
            </button>
            <Link
              href={`/${locale}/search`}
              className="px-6 py-3 rounded-full font-label-lg text-label-lg border-2 border-outline-variant text-on-surface-variant hover:border-primary transition-colors"
            >
              Reset
            </Link>
          </div>
        </form>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <SearchX size={72} strokeWidth={1.75} className="mx-auto mb-6 text-outline-variant" aria-hidden="true" />
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
              No matching socks
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-8">
              Try a different color, category, size, or price range.
            </p>
            <Link
              href={`/${locale}/search`}
              className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted={wishlistIds.has(product.id)}
                hasSession={Boolean(session)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
