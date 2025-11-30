import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
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
    <div className="min-h-screen" data-testid="page-home">
      <HeroSection />

      <section className="py-12 lg:py-20" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-medium text-foreground mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections designed for elegance and comfort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-card" data-testid="section-bestsellers">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-medium text-foreground mb-3">
              Best Sellers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved pieces chosen by customers just like you
            </p>
          </div>
          <ProductGrid 
            products={bestSellers || []} 
            isLoading={isLoading} 
            loadingCount={5}
          />
        </div>
      </section>

      <section className="py-12 lg:py-20" data-testid="section-about">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                About Aduke's Empire
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Aduke's Empire, we believe modest fashion should never compromise on style. 
                Our collections are thoughtfully designed to celebrate the beauty of modesty 
                while embracing contemporary trends.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each piece in our collection is crafted with premium materials and attention 
                to detail, ensuring you look and feel your absolute best. From everyday elegance 
                to special occasions, we have something for every moment.
              </p>
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-semibold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Quality Assured</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-foreground">24/7</p>
                  <p className="text-sm text-muted-foreground">WhatsApp Support</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={abayaProducts?.products[0] ? `/api/images/${abayaProducts.products[0].imageId}` : "https://i.pinimg.com/1200x/74/bb/9b/74bb9bf82e9c78675d96b8c117b06247.jpg"}
                alt="Elegant modest fashion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
