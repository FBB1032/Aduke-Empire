import { Link } from "wouter";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card 
      className="group overflow-visible border-card-border hover-elevate"
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.isBestSeller && (
            <Badge 
              className="absolute top-2 right-2 bg-primary text-primary-foreground gap-1"
              data-testid={`badge-bestseller-${product.id}`}
            >
              <Star className="w-3 h-3 fill-current" />
              Best Seller
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-3">
          <h3 
            className="font-medium text-foreground line-clamp-2 min-h-[2.5rem]"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <p 
            className="text-xl font-semibold text-foreground"
            data-testid={`text-product-price-${product.id}`}
          >
            {formatPrice(product.price)}
          </p>
          <Link href={`/product/${product.id}`}>
            <Button 
              variant="outline" 
              className="w-full"
              data-testid={`button-details-${product.id}`}
            >
              Show More Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-card-border">
      <CardContent className="p-0">
        <Skeleton className="aspect-square w-full rounded-t-lg" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
