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
  abaya: "https://i.pinimg.com/736x/34/8d/73/348d73a33ac64deb233af0c08dd197fe.jpg",
  scarf: "https://i.pinimg.com/1200x/3c/d5/1f/3cd51fedc207bf8ba46d5a2f75a0afeb.jpg",
  jallabiya: "https://i.pinimg.com/736x/8c/a0/d6/8ca0d6a8cf7f7c3de964406cdbec8501.jpg",
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const limit = 12;
  const isInitialLoad = useRef(true);

  const { data, isLoading, isFetching } = useQuery<{ products: Product[]; total: number }>({
    queryKey: [`/api/products?category=${category}&page=${page}&limit=${limit}`],
  });

  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products);
        isInitialLoad.current = false;
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = data.products.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
      const totalLoaded = page === 1 ? data.products.length : allProducts.length + data.products.length;
      setHasMore(totalLoaded < data.total);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
    isInitialLoad.current = true;
  }, [category]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore && !isInitialLoad.current) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore && !isInitialLoad.current) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
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
