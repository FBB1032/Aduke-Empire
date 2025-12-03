import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: bestSellers, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/bestsellers"],
  });

  const { data: abayaProducts } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products", { category: "abaya", limit: 1 }],
  });

  const { data: scarfProducts } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products", { category: "scarf", limit: 1 }],
  });

  const { data: jallabiyaProducts } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products", { category: "jallabiya", limit: 1 }],
  });

  const categories = [
    {
      title: "Abayas",
      description: "Elegant flowing robes crafted with premium fabrics for everyday grace",
      image: "https://i.pinimg.com/736x/34/8d/73/348d73a33ac64deb233af0c08dd197fe.jpg",
      href: "/abaya",
    },
    {
      title: "Scarves",
      description: "Luxurious hijabs and scarves in silk, chiffon, and premium cotton",
      image: "https://i.pinimg.com/1200x/3c/d5/1f/3cd51fedc207bf8ba46d5a2f75a0afeb.jpg",
      href: "/scarf",
    },
    {
      title: "Jallabiyas",
      description: "Traditional garments reimagined with contemporary elegance",
      image: "https://i.pinimg.com/736x/8c/a0/d6/8ca0d6a8cf7f7c3de964406cdbec8501.jpg",
      href: "/jallabiya",
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <HeroSection />

      <section className="py-16 lg:py-24" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 space-y-4">
            <h2 className="font-brand text-5xl lg:text-6xl text-primary drop-shadow-sm">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
              Explore our curated collections designed for elegance and comfort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/20 relative overflow-hidden" data-testid="section-bestsellers">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-16 space-y-4">
            <h2 className="font-brand text-5xl lg:text-6xl text-primary drop-shadow-sm">
              Best Sellers
            </h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
              Discover our most loved pieces chosen by customers just like you
            </p>
          </div>
          <ProductGrid 
            products={bestSellers || []} 
            isLoading={isLoading} 
            loadingCount={4}
          />
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="rounded-full px-8 py-6 border-primary/30 text-primary hover:bg-primary hover:text-white text-lg transition-all duration-300">
              View All Products
            </Button>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </section>

      <section className="py-16 lg:py-24" data-testid="section-about">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="font-brand text-5xl lg:text-6xl text-primary drop-shadow-sm">
                  About Aduke's Empire
                </h2>
                <div className="w-24 h-1 bg-primary/20 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  At Aduke's Empire, we believe modest fashion should never compromise on style. 
                  Our collections are thoughtfully designed to celebrate the beauty of modesty 
                  while embracing contemporary trends.
                </p>
                <p>
                  Each piece in our collection is crafted with premium materials and attention 
                  to detail, ensuring you look and feel your absolute best. From everyday elegance 
                  to special occasions, we have something for every moment.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">500+</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Happy Customers</p>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">100%</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Quality Assured</p>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
                  <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">24/7</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Support</p>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] rotate-6 transform scale-95 z-0"></div>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl z-10 border-4 border-white">
                <img
                  src={abayaProducts?.products[0] ? `/api/images/${abayaProducts.products[0].imageId}` : "https://i.pinimg.com/1200x/74/bb/9b/74bb9bf82e9c78675d96b8c117b06247.jpg"}
                  alt="Elegant modest fashion"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
