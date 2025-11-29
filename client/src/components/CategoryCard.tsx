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
        className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
        data-testid={`card-category-${title.toLowerCase()}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <h3 className="text-2xl lg:text-3xl font-medium text-white">{title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{description}</p>
          <Button 
            variant="outline"
            className="bg-white/10 border-white/30 text-white backdrop-blur-sm hover:bg-white/20"
            data-testid={`button-explore-${title.toLowerCase()}`}
          >
            Explore
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
