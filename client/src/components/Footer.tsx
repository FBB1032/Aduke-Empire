import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "2348154538190";

  return (
    <footer className="bg-secondary/30 border-t border-primary/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <div className="space-y-6">
            <span className="font-brand text-6xl text-primary drop-shadow-sm block mb-6">
              Aduke's Empire
            </span>
            <p className="text-muted-foreground text-base leading-relaxed font-light">
              Timeless modest fashion for the modern woman. Discover our curated collection of luxury Abayas, beautiful Scarves, and stunning Jallabiyas.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                aria-label="WhatsApp"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/adukes_empire9?igsh=MXhiMGhmbHRrMnZuaw%3D%3D&utm_source=qr"
                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <SiFacebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="font-brand text-3xl text-foreground">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/abaya">
                  <span className="text-muted-foreground hover:text-primary text-base cursor-pointer transition-colors flex items-center gap-3 group" data-testid="link-footer-abaya">
                    <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                    Abayas
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/scarf">
                  <span className="text-muted-foreground hover:text-primary text-base cursor-pointer transition-colors flex items-center gap-3 group" data-testid="link-footer-scarf">
                    <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                    Scarves
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/jallabiya">
                  <span className="text-muted-foreground hover:text-primary text-base cursor-pointer transition-colors flex items-center gap-3 group" data-testid="link-footer-jallabiya">
                    <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                    Jallabiyas
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="font-brand text-3xl text-foreground">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-primary text-base cursor-pointer transition-colors flex items-center gap-3 group" data-testid="link-footer-home">
                    <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-login">
                  <span className="text-muted-foreground hover:text-primary text-base cursor-pointer transition-colors flex items-center gap-3 group" data-testid="link-footer-admin">
                    <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                    Admin Login
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="font-brand text-3xl text-foreground">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-base text-muted-foreground group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="text-phone"
                >
                  +234 815 453 8190
                </a>
              </li>
              <li className="flex items-center gap-4 text-base text-muted-foreground group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span data-testid="text-email">Suleimanwasila873@gmail.com</span>
              </li>
              <li className="flex items-start gap-4 text-base text-muted-foreground group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span data-testid="text-address">NASSARAWA, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-16 pt-8 text-center">
          <p className="text-muted-foreground text-sm font-light tracking-wide" data-testid="text-copyright">
            &copy; {currentYear} Aduke's Empire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
