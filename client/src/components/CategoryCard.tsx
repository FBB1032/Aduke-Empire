import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export function CategoryCard({ title, description, image, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div 
        className="group relative aspect-3/4 overflow-hidden rounded-4xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
        data-testid={`card-category-${title.toLowerCase()}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transform transition-transform duration-500">
          <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-brand text-6xl lg:text-7xl text-white drop-shadow-md mb-4">{title}</h3>
            <div className="w-16 h-1 bg-white/50 mx-auto rounded-full mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
            <p className="text-white/95 text-lg font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 max-w-xs mx-auto">
              {description}
            </p>
          </div>
          
          <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 translate-y-4 group-hover:translate-y-0">
            <Button 
              variant="outline"
              className="bg-white/20 border-white/60 text-white backdrop-blur-md hover:bg-white hover:text-primary rounded-full px-8 py-6 text-base border"
              data-testid={`button-explore-${title.toLowerCase()}`}
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
