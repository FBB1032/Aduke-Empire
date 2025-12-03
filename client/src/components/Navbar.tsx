import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home", testId: "home" },
  { href: "/abaya", label: "Abaya", testId: "abaya" },
  { href: "/scarf", label: "Scarf", testId: "scarf" },
  { href: "/jallabiya", label: "Jallabiya", testId: "jallabiya" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header 
      className="navbar-lux w-full shadow-lg shadow-primary/5"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-20 lg:h-24 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home-logo">
            <span className="navbar-logo cursor-pointer drop-shadow-[0_0_10px_rgba(212,175,55,0.25)] hover:opacity-90 transition-opacity pt-2">
              Aduke's Empire
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-full px-6 h-10 ${
                    location === link.href
                      ? "text-primary bg-primary/10 font-semibold shadow-[0_0_15px_rgba(219,112,147,0.2)]"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${link.testId}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/admin-login">
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary-foreground hover:border-primary rounded-full px-6 h-10 transition-all duration-300"
                data-testid="link-admin"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu" className="hover:bg-primary/5 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] border-l-primary/20 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col gap-6 mt-8">
                <span className="font-brand text-4xl text-primary mb-2 text-center drop-shadow-[0_0_8px_rgba(219,112,147,0.4)]">
                  Aduke's Empire
                </span>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-base uppercase tracking-widest h-12 rounded-xl ${
                            location === link.href
                              ? "text-primary bg-primary/10 font-semibold"
                              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          }`}
                          data-testid={`link-mobile-${link.testId}`}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                <SheetClose asChild>
                  <Link href="/admin-login">
                    <Button
                      variant="outline"
                      className="w-full justify-start mt-4 h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary"
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
