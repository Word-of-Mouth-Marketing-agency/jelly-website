import { Heart } from "lucide-react";
import Image from "next/image";

export interface Product {
  name: string;
  price: string;
  image: string;
  alt?: string;
}

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
}

export default function ProductCard({
  product,
  showWishlist = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sticker-border group">
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
        {showWishlist && (
          <button className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:text-error transition-colors">
            <Heart size={20} strokeWidth={2.25} aria-hidden="true" />
          </button>
        )}
        <Image
          src={product.image}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          alt={product.alt ?? product.name}
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      <h4 className="font-body-lg text-body-lg mb-1 truncate">{product.name}</h4>
      <div className="inline-block px-3 py-1 bg-brand-cyan rounded-full font-bold text-label-sm mb-4">
        {product.price}
      </div>
      <button className="w-full bg-primary-container text-black py-2 rounded-full font-label-lg text-label-lg sticker-border hover:bg-primary-fixed-dim transition-colors">
        Add to Cart
      </button>
    </div>
  );
}
