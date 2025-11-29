import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/ProductGrid";
import { categoryLabels, type Category, type Product } from "@shared/schema";
import { useEffect, useState, useCallback, useRef } from "react";

interface CategoryPageProps {
  category: Category;
}

const categoryDescriptions: Record<Category, string> = {
  abaya: "Discover our collection of elegant Abayas crafted with premium fabrics. From classic black to contemporary designs, find your perfect everyday statement piece.",
  scarf: "Explore our luxurious range of Scarves and Hijabs in silk, chiffon, and cotton. Beautiful patterns and solid colors to complement any outfit.",
  jallabiya: "Browse our stunning Jallabiyas collection blending traditional craftsmanship with modern design. Perfect for special occasions and everyday elegance.",
};

const categoryImages: Record<Category, string> = {
  abaya: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1974&auto=format&fit=crop",
  scarf: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=1974&auto=format&fit=crop",
  jallabiya: "https://images.unsplash.com/photo-1585486386606-e95f8e4d95f4?q=80&w=1974&auto=format&fit=crop",
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const limit = 12;

  const { data, isLoading, isFetching } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["/api/products", category, page],
    queryFn: async () => {
      const res = await fetch(`/api/products?category=${category}&page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts((prev) => [...prev, ...data.products]);
      }
      setHasMore(allProducts.length + data.products.length < data.total);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [category]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isFetching, hasMore]);

  return (
    <div className="min-h-screen" data-testid={`page-${category}`}>
      <section className="relative h-[40vh] lg:h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${categoryImages[category]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4 space-y-4 max-w-3xl mx-auto">
          <h1 
            className="text-4xl lg:text-5xl xl:text-6xl font-medium text-white"
            data-testid="text-category-title"
          >
            {categoryLabels[category]}
          </h1>
          <p className="text-white/80 text-base lg:text-lg max-w-2xl mx-auto">
            {categoryDescriptions[category]}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground" data-testid="text-product-count">
              {data?.total || 0} products
            </p>
          </div>

          <ProductGrid 
            products={allProducts} 
            isLoading={isLoading && page === 1}
          />

          {isFetching && page > 1 && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading more...</span>
              </div>
            </div>
          )}

          {hasMore && !isFetching && (
            <div ref={loadMoreRef} className="h-20" />
          )}

          {!hasMore && allProducts.length > 0 && (
            <p className="text-center text-muted-foreground py-8" data-testid="text-end-of-list">
              You've seen all products in this category
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
