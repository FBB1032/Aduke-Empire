import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="hero-lux"
      data-testid="hero-section"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590654879707-9a62ad10c5b4?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="sparkles" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 reveal in-view">
        <h1 
          className="h1-script"
          data-testid="text-hero-title"
        >
          Aduke's Empire
        </h1>
        <div className="space-y-6">
          <p 
            className="subtitle text-xl lg:text-2xl max-w-2xl mx-auto tracking-[0.2em] uppercase border-y border-[rgba(212,175,55,0.35)] py-4 backdrop-blur-sm"
            data-testid="text-hero-subtitle"
          >
            Timeless Modest Fashion
          </p>
          <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Discover our curated collection of luxury Abayas, beautiful Scarves, and stunning Jallabiyas crafted for the modern woman.
          </p>
        </div>
        <div className="pt-10">
          <Link href="/abaya">
            <Button 
              size="lg"
              className="btn-gold px-12 py-8 rounded-full text-lg"
              data-testid="button-shop-abayas"
            >
              <span className="shine" />
              Shop Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
