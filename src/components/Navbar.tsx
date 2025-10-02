"use client";
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import caflong from "@/assets/CAFLongBranco.png";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const currUrl = usePathname();

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Masculino",
      href: "#masculino",
      dropdown: ["Sport", "Classic", "Modern"],
    },
    {
      name: "Feminino",
      href: "#feminino",
      dropdown: ["Sport", "Classic", "Modern"],
    },
    { name: "Lançamentos", href: "#lancamentos" },
    { name: "Sport", href: "#sport" },
    { name: "Classic", href: "#classic" },
    { name: "Rastreio", href: "#rastreio" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          currUrl === "/"
            ? isScrolled || isMobileMenuOpen
              ? "navbar-glass"
              : "bg-transparent"
            : "navbar-glass"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Desktop */}
            <div className="hidden md:flex items-center">
              <Link href="/">
                <Image
                  src={caflong}
                  alt="Chase a Flare Logo"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button className="text-foreground hover:text-accent transition-smooth font-medium relative group flex items-center gap-1">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-background border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem}
                            href={`#${subItem.toLowerCase()}`}
                            className="block px-4 py-3 text-sm text-foreground hover:text-accent hover:bg-accent/5 transition-smooth"
                          >
                            {subItem}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="text-foreground hover:text-accent transition-smooth font-medium relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover-glow">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover-glow relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  0
                </span>
              </Button>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>

              {/* Mobile Logo */}
              <div className="flex items-center">
                <Image
                  src={caflong}
                  alt="Chase a Flare Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="hover-glow">
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover-glow relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    0
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-2 mt-4">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-border/50 last:border-b-0"
                  >
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === item.name ? null : item.name
                            )
                          }
                          className="w-full flex items-center justify-between text-foreground hover:text-accent transition-smooth font-medium py-3"
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openDropdown === item.name && (
                          <div className="pl-4 pb-2 space-y-2">
                            {item.dropdown.map((subItem) => (
                              <a
                                key={subItem}
                                href={`#${subItem.toLowerCase()}`}
                                className="block text-sm text-foreground/80 hover:text-accent transition-smooth py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="block text-foreground hover:text-accent transition-smooth font-medium py-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;