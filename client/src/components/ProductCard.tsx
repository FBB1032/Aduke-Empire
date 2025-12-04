import { Link } from "wouter";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductCardProps { product: Product; }

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('en-NG',{ style:'currency', currency:'NGN', minimumFractionDigits:0, maximumFractionDigits:0 }).format(price);

  return (
    <Card 
      className="group rounded-3xl bg-black/40 backdrop-blur-md border border-rose-300/30 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-4/5 overflow-hidden">
          <img src={`/api/images/${product.imageId}`} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" loading="lazy" />
          {product.isBestSeller && (
            <Badge
              className="absolute top-3 left-3 md:top-4 md:left-4 px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-yellow-400 text-black ring-2 ring-amber-400/60 shadow-[0_4px_16px_rgba(251,191,36,0.55)]"
              data-testid={`badge-bestseller-${product.id}`}
           >
              <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-600 text-amber-700" />
              Best Seller
            </Badge>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>
        <div className="p-4 md:p-6">
          <h3 className="text-rose-100 text-xl font-[cursive] drop-shadow-sm line-clamp-1" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
          <p className="mt-1 text-rose-200/80 text-xs uppercase tracking-widest">{product.category}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-rose-100 text-lg" data-testid={`text-product-price-${product.id}`}>{formatPrice(product.price)}</span>
            <Link href={`/product/${product.id}`}>
              <Button className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-300 text-black font-medium shadow hover:shadow-amber-300/40 transition-all duration-300" data-testid={`button-details-${product.id}`}>
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-rose-300/20 rounded-3xl bg-black/30 backdrop-blur-md shadow">
      <CardContent className="p-0">
        <Skeleton className="aspect-4/5 w-full bg-black/20" />
        <div className="p-4 md:p-6 space-y-4">
          <Skeleton className="h-6 w-3/4 bg-black/20" />
          <Skeleton className="h-4 w-1/3 bg-black/20" />
          <Skeleton className="h-10 w-full rounded-full bg-black/20" />
        </div>
      </CardContent>
    </Card>
  );
}
