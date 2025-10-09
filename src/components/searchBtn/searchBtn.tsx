"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import oculos1 from "@/assets/glasses-1.jpg";
import oculos2 from "@/assets/glasses-2.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: StaticImageData | string;
}
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Óculos de Sol Aviador Clássico",
    price: 350,
    slug: "aviador-classico-1",
    imageUrl: oculos1,
  },
  {
    id: "2",
    name: "Óculos de Grau Wayfarer Moderno",
    price: 420,
    slug: "wayfarer-moderno",
    imageUrl: oculos2,
  },
  {
    id: "3",
    name: "Óculos de Sol Clubmaster Vintage",
    price: 390,
    slug: "clubmaster-vintage",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Óculos de Grau Redondo Retrô",
    price: 280,
    slug: "redondo-retro",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Óculos de Sol Esportivo Polarizado",
    price: 450,
    slug: "esportivo-polarizado",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Óculos de Sol Aviador Gold",
    price: 370,
    slug: "aviador-gold",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Óculos de Grau Gatinho Elegance",
    price: 310,
    slug: "gatinho-elegance",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Óculos de Sol Hexagonal Estiloso",
    price: 330,
    slug: "hexagonal-estiloso",
    imageUrl: "/placeholder.svg",
  },
];
const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query) return [];
  await new Promise((resolve) => setTimeout(resolve, 500));
  const lowerCaseQuery = query.toLowerCase();
  return mockProducts.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseQuery)
  );
};

export function SearchPopover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      searchProducts(debouncedQuery).then((res) => {
        setResults(res);
        setIsLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const modernInputStyle =
    "w-full rounded-xl bg-gray-100 px-4 py-2 shadow-sm focus:bg-white focus:shadow-md transition-all outline-none border-none text-primary";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="relative bg-transparent hover:bg-accent hover:text-primary text-white hover-glow cursor-pointer"
        >
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-white rounded-xl shadow-lg border-none w-[500px] p-4"
        align="end"
        sideOffset={8}
      >
        <div className="flex w-full items-center gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Procure por um modelo de óculos..."
            className={modernInputStyle}
          />
        </div>
        
        <div
          className={`
            transition-all duration-300 ease-in-out 
            overflow-y-auto 
            ${
              results.length > 0 || isLoading
                ? "max-h-[400px] mt-4"
                : "max-h-0 mt-0"
            }
          `}
        >
          <div className="space-y-2">
            {isLoading && (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && debouncedQuery && results.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>Nenhum resultado encontrado.</p>
              </div>
            )}

            {results.map((product) => (
              <Link
                href={`/produto/${product.slug}`}
                key={product.id}
                className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-md bg-gray-200"
                />
                <div>
                  <p className="font-semibold text-primary">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
