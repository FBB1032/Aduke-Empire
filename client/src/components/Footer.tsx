import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "2348154538190";

  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <span className="font-brand text-3xl text-foreground">
              Aduke's Empire
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Timeless modest fashion for the modern woman. Discover our curated collection of luxury Abayas, beautiful Scarves, and stunning Jallabiyas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center hover-elevate"
                aria-label="WhatsApp"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/adukes_empire9?igsh=MXhiMGhmbHRrMnZuaw%3D%3D&utm_source=qr"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center hover-elevate"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center hover-elevate"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <SiFacebook className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/abaya">
                  <span className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors" data-testid="link-footer-abaya">
                    Abayas
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/scarf">
                  <span className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors" data-testid="link-footer-scarf">
                    Scarves
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/jallabiya">
                  <span className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors" data-testid="link-footer-jallabiya">
                    Jallabiyas
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors" data-testid="link-footer-home">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-login">
                  <span className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors" data-testid="link-footer-admin">
                    Admin Login
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  data-testid="text-phone"
                >
                  +234 815 453 8190
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span data-testid="text-email">Suleimanwasila873@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span data-testid="text-address">NASSARAWA, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 text-center">
          <p className="text-muted-foreground text-sm" data-testid="text-copyright">
            &copy; {currentYear} Aduke's Empire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
