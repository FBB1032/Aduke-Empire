import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Star, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categoryLabels, type Product, type Category } from "@shared/schema";
import quotes from "@/quotes.json";

const WHATSAPP_PHONE = "2348154538190";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [showTestimonials, setShowTestimonials] = useState(false);

  const testimonials = [
    { quote: "Absolutely stunning quality. I felt elegant all day.", author: "Aisha" },
    { quote: "Perfect fit and fabric. Worth every naira.", author: "Zara" },
    { quote: "Fast response on WhatsApp and swift delivery.", author: "Maryam" },
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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
    details.push(`Unit Price: ${formatPrice(product.price)}`);
    details.push(`Quantity: ${quantity}`);
    const total = product.price * quantity;
    details.push(`Total: ${formatPrice(total)}`);
    if (product.size) details.push(`Size: ${product.size}`);

    const message = encodeURIComponent(
      `I would like to purchase:\n\n${details.join("\n")}\n\nPlease confirm availability.`
    );
    return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow navigation, but show testimonials in the current tab
    setShowTestimonials(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8" data-testid="page-product-loading">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Skeleton className="h-6 w-32 mb-8 rounded-full" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-3/4 rounded-4xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-8 w-1/3 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
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
    <div className="min-h-screen py-12 lg:py-16 bg-background" data-testid="page-product-details">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Link href={`/${product.category}`}>
          <Button 
            variant="ghost" 
            className="mb-8 -ml-2 hover:text-primary hover:bg-primary/5 rounded-full px-6 h-12 text-base"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {categoryLabels[product.category as Category]}
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-secondary/10 shadow-2xl border border-white/50">
            <img
              src={`/api/images/${product.imageId}`}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product"
            />
            {product.isBestSeller && (
              <Badge 
                className="absolute top-6 right-6 md:top-8 md:right-8 bg-gradient-to-r from-amber-300 to-yellow-400 text-black px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-wider ring-2 ring-amber-400/60 shadow-[0_6px_20px_rgba(251,191,36,0.55)] border border-amber-200/50 gap-2"
                data-testid="badge-bestseller"
              >
                <Star className="w-4 h-4 mr-1.5 fill-amber-600 text-amber-700" />
                Best Seller
              </Badge>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.25em] text-primary font-medium border-b border-primary/10 pb-4 inline-block">
                  {categoryLabels[product.category as Category]}
                </p>
                <h1 
                  className="font-brand text-6xl lg:text-7xl text-foreground leading-tight drop-shadow-sm"
                  data-testid="text-product-name"
                >
                  {product.name}
                </h1>
              </div>
              <p 
                className="text-4xl lg:text-5xl font-medium text-primary font-brand"
                data-testid="text-product-price"
              >
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {product.size && (
                <div className="bg-secondary/20 rounded-3xl p-8 border border-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">Size</p>
                  <p
                    className="font-medium text-foreground text-2xl"
                    data-testid="text-product-size"
                  >
                    {product.size}
                  </p>
                </div>
              )}
              <div className="bg-secondary/20 rounded-3xl p-8 border border-secondary/30 text-center">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">Quantity</p>
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-full w-10 h-10" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center rounded-2xl border-input/60 bg-white/60 text-foreground"
                    aria-label="Quantity"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-full w-10 h-10" 
                    onClick={() => setQuantity(q => q + 1)} 
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-6 border-t border-primary/10">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid="link-whatsapp-buy"
                onClick={handleWhatsAppClick}
              >
                <Button 
                  size="lg" 
                  className="w-full rounded-full px-8 py-8 text-xl font-semibold tracking-wide bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.6)] hover:-translate-y-[2px] transition-all duration-300 border border-white/10 relative overflow-hidden"
                >
                  <span className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.35),transparent_40%)]" />
                  <span className="absolute inset-0 opacity-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.25),transparent_40%,rgba(255,255,255,0.2))]" />
                  <SiWhatsapp className="w-7 h-7 mr-3 flex-shrink-0" />
                  <span className="relative z-10">Buy Now via WhatsApp</span>
                </Button>
              </a>
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2 font-light">
                <Phone className="w-4 h-4" />
                We'll respond within minutes to confirm your order
              </p>
            </div>

            {/* Testimonials modal */}
            <Dialog open={showTestimonials} onOpenChange={setShowTestimonials}>
              <DialogContent className="rounded-3xl bg-black/70 backdrop-blur-md border border-amber-300/30 text-foreground max-w-xl">
                <DialogHeader>
                  <DialogTitle className="font-brand text-2xl">What our customers say</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Random elegant quote */}
                  <blockquote className="p-4 rounded-2xl bg-white/10 border border-white/20 italic">
                    <p className="text-lg">“{randomQuote}”</p>
                  </blockquote>
                  {/* Fixed short testimonials */}
                  {testimonials.map((t, i) => (
                    <blockquote key={i} className="p-4 rounded-2xl bg-white/10 border border-white/20 italic">
                      <p className="text-lg">“{t.quote}”</p>
                      <cite className="block mt-2 text-sm text-muted-foreground">— {t.author}</cite>
                    </blockquote>
                  ))}
                </div>
                <div className="pt-4 text-sm text-muted-foreground">Aduke's Empire • Timeless modest fashion</div>
              </DialogContent>
            </Dialog>

            <div className="pt-8 space-y-8">
              <h3 className="font-brand text-4xl text-foreground">Product Details</h3>
              <ul className="space-y-5 text-muted-foreground text-lg font-light leading-relaxed">
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Premium quality fabric selected for comfort
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Comfortable fit designed for all-day wear
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Elegant design suitable for any occasion
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Easy care instructions for longevity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
