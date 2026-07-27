import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import caflong from "../assets/CAFLongBranco.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="py-12 border-b border-primary-foreground/20">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-yellow">Stay Updated</h3>
            <p className="text-primary-foreground/80">
              Get the latest eyewear trends and exclusive offers delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button
                variant="yellow"
                className="font-semibold bg-accent text-primary"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-start">
              <Image
                src={caflong}
                alt="Chase a Flare"
                className="h-28 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your trusted partner for premium eyewear. Quality frames, expert
              service, and the latest in optical technology.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="group text-background hover:text-primary hover:bg-accent"
              >
                <Facebook className="h-5 w-5 text-accent group-hover:text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="group text-background hover:text-primary hover:bg-accent"
              >
                <Twitter className="h-5 w-5 text-accent group-hover:text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="group text-background hover:text-primary hover:bg-accent"
              >
                <Instagram className="h-5 w-5 text-accent group-hover:text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="group text-background hover:text-primary hover:bg-accent"
              >
                <Youtube className="h-5 w-5 text-accent group-hover:text-primary" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-yellow">Quick Links</h4>
            <div className="space-y-2">
              {[
                "Shop All",
                "Eyeglasses",
                "Sunglasses",
                "Contact Lenses",
                "Brands",
                "Sale",
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-yellow">
              Customer Service
            </h4>
            <div className="space-y-2">
              {[
                "Help Center",
                "Size Guide",
                "Return Policy",
                "Shipping Info",
                "Track Order",
                "Contact Us",
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-yellow">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow" />
                <span className="text-primary-foreground/80 text-sm">
                  1-800-CAF
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow" />
                <span className="text-primary-foreground/80 text-sm">
                  support@chaseaflare.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-yellow" />
                <span className="text-primary-foreground/80 text-sm">
                  123 CAF St, Eye City
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 Chase a Flare. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="#"
              className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
