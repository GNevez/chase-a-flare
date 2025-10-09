"use client";

import { useState } from "react";
import { Pagination } from "@/components/collection/pagination";
import { ProductList } from "@/components/collection/productList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FilterCombobox } from "@/components/collection/FilterCombobox";
import { CollectionBanner } from "@/components/collection/CollectionBanner";
import products from "@/hooks/temp-data/products.json";

const sortOptions = [
  {
    value: "relevance",
    label: "Relevância",
  },
  {
    value: "price-asc",
    label: "Preço: Menor para o Maior",
  },
  {
    value: "price-desc",
    label: "Preço: Maior para o Menor",
  },
  {
    value: "newest",
    label: "Mais Recentes",
  },
];

const ITEMS_PER_PAGE = 8;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="font-display bg-white pt-28">
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <CollectionBanner />
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="w-full pl-12 pr-4 text-sm font-light transition-colors"
                placeholder="Buscar óculos..."
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterCombobox options={sortOptions} />
              <FilterCombobox options={sortOptions} />
              <FilterCombobox options={sortOptions} />
            </div>
          </div>
          <ProductList products={products} />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
