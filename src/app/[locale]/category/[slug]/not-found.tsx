import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="material-symbols-outlined text-8xl text-outline-variant block mb-6">
          category
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">
          Category not found
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md mb-8">
          This category doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/en"
          className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
