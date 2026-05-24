import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">
          Back to products
        </Link>
        <h1 className="font-display-lg text-display-lg text-on-surface mt-2">Create Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
