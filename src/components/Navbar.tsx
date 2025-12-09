import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Fitur" },
    { href: "#pricing", label: "Harga" },
    { href: "#testimonials", label: "Testimoni" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-lg shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Live<span className="text-gradient">Forge</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium rounded-lg hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">Masuk</Button>
            <Button variant="gradient" size="sm">
              Coba Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-in">
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium rounded-lg hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-center">Masuk</Button>
              <Button variant="gradient" className="w-full justify-center">Coba Gratis</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
