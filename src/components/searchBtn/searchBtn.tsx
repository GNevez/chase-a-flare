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
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductSearch, type SearchProduct } from "@/hooks/useProductSearch";

export function SearchPopover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const { isSearching, searchProducts } = useProductSearch();
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts(debouncedQuery).then((res) => setResults(res));
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
              results.length > 0 ||
              isSearching ||
              (debouncedQuery && results.length === 0)
                ? "max-h-[400px] mt-4"
                : "max-h-0 mt-0"
            }
          `}
        >
          {isSearching && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!isSearching && debouncedQuery && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                Nenhum produto encontrado com "{debouncedQuery}".
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Tente buscar por outro termo.
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3 px-2">
                Produtos:
              </h3>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    href={`/product/${product.slug}`}
                    key={product.id}
                    className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md bg-gray-200 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-primary">
                        {product.name}
                      </p>
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
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
