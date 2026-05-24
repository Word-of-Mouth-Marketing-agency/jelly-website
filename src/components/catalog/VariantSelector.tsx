"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: string;
  price: string;
  stock: number;
  size: { id: string; label: string };
  color: { id: string; nameEn: string; nameAr: string; hex: string };
};

interface Props {
  variants: Variant[];
  locale?: string;
}

const SIZE_ORDER = ["S", "M", "L", "XL", "One Size"];

function sizeRank(label: string) {
  const index = SIZE_ORDER.indexOf(label);
  return index === -1 ? SIZE_ORDER.length : index;
}

export default function VariantSelector({ variants, locale = "en" }: Props) {
  const isRtl = locale === "ar";

  const colors = useMemo(() => {
    const map = new Map<string, Variant["color"]>();
    variants.forEach((variant) => map.set(variant.color.id, variant.color));
    return Array.from(map.values());
  }, [variants]);

  const sizes = useMemo(() => {
    const map = new Map<string, Variant["size"]>();
    variants.forEach((variant) => map.set(variant.size.id, variant.size));
    return Array.from(map.values()).sort(
      (a, b) => sizeRank(a.label) - sizeRank(b.label)
    );
  }, [variants]);

  const [selectedColorId, setSelectedColorId] = useState(
    colors.find((color) =>
      variants.some((variant) => variant.color.id === color.id && variant.stock > 0)
    )?.id ??
      colors[0]?.id ??
      ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState(
    sizes.find((size) =>
      variants.some((variant) => variant.size.id === size.id && variant.stock > 0)
    )?.id ??
      sizes[0]?.id ??
      ""
  );

  const activeVariant = variants.find(
    (variant) =>
      variant.color.id === selectedColorId && variant.size.id === selectedSizeId
  );

  function isColorInStock(colorId: string) {
    return variants.some(
      (variant) => variant.color.id === colorId && variant.stock > 0
    );
  }

  function isSizeAvailable(sizeId: string) {
    return variants.some(
      (variant) =>
        variant.size.id === sizeId &&
        variant.color.id === selectedColorId &&
        variant.stock > 0
    );
  }

  const selectedColor = colors.find((color) => color.id === selectedColorId);
  const displayColorName = isRtl
    ? selectedColor?.nameAr
    : selectedColor?.nameEn;

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-on-surface-variant mb-3">
            Color: <span className="text-on-surface">{displayColorName}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const inStock = isColorInStock(color.id);
              const selected = color.id === selectedColorId;
              const label = isRtl ? color.nameAr : color.nameEn;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  aria-label={label}
                  title={label}
                  disabled={!inStock}
                  className={`w-9 h-9 rounded-full border-[3px] transition-all ${
                    selected
                      ? "border-primary scale-110 shadow-lg"
                      : "border-transparent hover:border-outline hover:scale-105"
                  } ${
                    !inStock
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-on-surface-variant mb-3">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = isSizeAvailable(size.id);
              const selected = size.id === selectedSizeId;

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSizeId(size.id)}
                  disabled={!available}
                  className={`min-w-[48px] px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                    selected
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant text-on-surface-variant hover:border-primary"
                  } ${
                    !available
                      ? "opacity-30 cursor-not-allowed line-through"
                      : "cursor-pointer"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeVariant && (
        <div className="bg-surface-container rounded-xl px-4 py-3 text-sm">
          {activeVariant.stock > 0 ? (
            <p className="text-on-surface">
              <span className="font-semibold text-tertiary">In stock</span>
              <span className="text-on-surface-variant ml-2">
                ({activeVariant.stock} available)
              </span>
            </p>
          ) : (
            <p className="text-error font-semibold">Out of stock</p>
          )}
        </div>
      )}

      <button
        type="button"
        disabled={!activeVariant || activeVariant.stock === 0}
        className="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
      >
        Add to Cart
      </button>
    </div>
  );
}
