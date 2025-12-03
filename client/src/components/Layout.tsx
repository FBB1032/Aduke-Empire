import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg] text-[--color-text]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && (
        <div className="footer-lux">
          <Footer />
        </div>
      )}
    </div>
  );
}
