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
    "w-full rounded-xl bg-gray-100 px-4 py-3 shadow-sm focus:bg-white focus:shadow-md transition-all outline-none border-none text-primary placeholder:text-gray-400";

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
        className="bg-white rounded-xl shadow-2xl border-none w-[95vw] sm:w-[450px] md:w-[500px] p-3 sm:p-4"
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
            overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            ${
              results.length > 0 ||
              isSearching ||
              (debouncedQuery && results.length === 0)
                ? "max-h-[50vh] sm:max-h-[400px] mt-3 sm:mt-4"
                : "max-h-0 mt-0"
            }
          `}
        >
          {isSearching && (
            <div className="flex flex-col items-center justify-center p-8 sm:p-6">
              <Loader2 className="h-7 w-7 sm:h-6 sm:w-6 animate-spin text-primary mb-2" />
              <p className="text-sm text-gray-500">Buscando produtos...</p>
            </div>
          )}

          {!isSearching && debouncedQuery && results.length === 0 && (
            <div className="p-6 sm:p-6 text-center">
              <div className="mb-3">
                <Search className="h-12 w-12 mx-auto text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium">
                Nenhum produto encontrado
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Tente buscar com outro termo
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1 sm:px-2">
                {results.length}{" "}
                {results.length === 1
                  ? "Produto encontrado"
                  : "Produtos encontrados"}
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {results.map((product) => (
                  <Link
                    href={`/product/${product.slug}`}
                    key={product.id}
                    className="flex items-center gap-3 sm:gap-4 rounded-lg p-2 sm:p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={56}
                        height={56}
                        className="rounded-lg bg-gray-200 object-cover w-14 h-14 sm:w-16 sm:h-16 group-hover:shadow-md transition-shadow"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary text-sm sm:text-base truncate group-hover:text-accent transition-colors">
                        {product.name}
                      </p>
                      <p className="text-sm sm:text-base text-accent font-medium mt-0.5">
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
