import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="relative min-h-[60vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590654879707-9a62ad10c5b4?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
        <h1 
          className="font-brand text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white"
          data-testid="text-hero-title"
        >
          Aduke's Empire
        </h1>
        <p 
          className="text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto"
          data-testid="text-hero-subtitle"
        >
          Timeless Modest Fashion
        </p>
        <p className="text-white/70 text-base lg:text-lg max-w-xl mx-auto">
          Discover our curated collection of luxury Abayas, beautiful Scarves, and stunning Jallabiyas crafted for the modern woman.
        </p>
        <div className="pt-4">
          <Link href="/abaya">
            <Button 
              size="lg"
              className="bg-white/10 border border-white/30 text-white backdrop-blur-md hover:bg-white/20 text-base px-8"
              data-testid="button-shop-abayas"
            >
              Shop Abayas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
