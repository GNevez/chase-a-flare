"use client";

import { useState, useMemo, useEffect } from "react";
import { Pagination } from "@/components/collection/pagination";
import { ProductList } from "@/components/collection/productList";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { FilterCombobox } from "@/components/collection/FilterCombobox";
import { CollectionBanner } from "@/components/collection/CollectionBanner";
import { useProductsBySlug } from "@/hooks/useProductsBySlug";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const collectionSlug = params.collection as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const { products, category, isLoading, error } =
    useProductsBySlug(collectionSlug);

  // Reset página quando mudar de coleção
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setSortBy("relevance");
  }, [collectionSlug]);

  // Filtrar produtos por busca
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.nome.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.categoriaNome.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Ordenar produtos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => Number(a.preco) - Number(b.preco));
      case "price-desc":
        return sorted.sort((a, b) => Number(b.preco) - Number(a.preco));
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginação
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Loading state
  if (isLoading) {
    return (
      <div className="font-display bg-white pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-primary text-lg">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="font-display bg-white pt-28 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Erro ao carregar produtos</p>
          <p className="text-primary/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-white pt-28">
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <CollectionBanner category={category} />
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="w-full pl-12 pr-4 text-sm font-light transition-colors"
                placeholder="Buscar óculos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset para primeira página ao buscar
                }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterCombobox
                options={sortOptions}
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
                placeholder="Ordenar por"
              />
            </div>
          </div>

          {currentProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-primary/60 text-lg">
                {searchQuery
                  ? `Nenhum produto encontrado para "${searchQuery}"`
                  : "Nenhum produto disponível nesta coleção"}
              </p>
            </div>
          ) : (
            <>
              <ProductList products={currentProducts} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
