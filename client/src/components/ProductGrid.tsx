import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  loadingCount?: number;
}

export function ProductGrid({ products, isLoading, loadingCount = 8 }: ProductGridProps) {
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        data-testid="grid-products-loading"
      >
        {Array.from({ length: loadingCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div 
        className="text-center py-24 bg-card/40 rounded-3xl border border-primary/15 backdrop-blur-md shadow-lg"
        data-testid="empty-products"
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary/20 shadow-[0_0_20px_rgba(219,112,147,0.2)] flex items-center justify-center border border-primary/20">
            <svg
              className="w-10 h-10 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-brand text-primary drop-shadow-[0_0_12px_rgba(219,112,147,0.35)]">No products found</h3>
            <p className="text-muted-foreground text-base font-light">
              We're working on adding new products to this collection. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div 
        className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        data-testid="grid-products"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
