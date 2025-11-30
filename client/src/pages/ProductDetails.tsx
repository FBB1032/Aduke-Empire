import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Star, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabels, type Product, type Category } from "@shared/schema";

const WHATSAPP_PHONE = "2348154538190";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateWhatsAppLink = () => {
    if (!product) return "#";
    const details = [];
    details.push(`Product: ${product.name}`);
    details.push(`Price: ${formatPrice(product.price)}`);
    if (product.size) details.push(`Size: ${product.size}`);

    const message = encodeURIComponent(
      `I will love to purchase:\n\n${details.join('\n')}\n\nPlease confirm availability.`
    );
    return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8" data-testid="page-product-loading">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="page-product-error">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-2xl font-medium text-foreground">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="page-product-details">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Link href={`/${product.category}`}>
          <Button 
            variant="ghost" 
            className="mb-6 -ml-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryLabels[product.category as Category]}
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
            <img
              src={`/api/images/${product.imageId}`}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product"
            />
            {product.isBestSeller && (
              <Badge 
                className="absolute top-4 right-4 bg-primary text-primary-foreground gap-1"
                data-testid="badge-bestseller"
              >
                <Star className="w-3 h-3 fill-current" />
                Best Seller
              </Badge>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                {categoryLabels[product.category as Category]}
              </p>
              <h1 
                className="text-2xl lg:text-3xl font-medium text-foreground"
                data-testid="text-product-name"
              >
                {product.name}
              </h1>
              <p 
                className="text-3xl lg:text-4xl font-semibold text-foreground"
                data-testid="text-product-price"
              >
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {product.size && (
                <div className="bg-card rounded-lg p-4 border border-card-border">
                  <p className="text-sm text-muted-foreground mb-1">Size</p>
                  <p
                    className="font-medium text-foreground"
                    data-testid="text-product-size"
                  >
                    {product.size}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid="link-whatsapp-buy"
              >
                <Button 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-base"
                >
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  Buy Now via WhatsApp
                </Button>
              </a>
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                We'll respond within minutes
              </p>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-medium text-foreground">Product Details</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>Premium quality fabric</li>
                <li>Comfortable fit for all-day wear</li>
                <li>Elegant design for any occasion</li>
                <li>Easy care instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
