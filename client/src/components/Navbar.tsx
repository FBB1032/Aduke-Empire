import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/abaya", label: "Abaya" },
  { href: "/scarf", label: "Scarf" },
  { href: "/jallabiya", label: "Jallabiya" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home-logo">
            <span className="font-brand text-2xl lg:text-3xl text-foreground cursor-pointer">
              Aduke's Empire
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-sm uppercase tracking-wide font-medium ${
                    location === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/admin-login">
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                data-testid="link-admin"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                <span className="font-brand text-2xl text-foreground mb-4">
                  Aduke's Empire
                </span>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-base uppercase tracking-wide ${
                          location === link.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                        data-testid={`link-mobile-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link href="/admin-login">
                    <Button
                      variant="outline"
                      className="w-full justify-start mt-4"
                      data-testid="link-mobile-admin"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
