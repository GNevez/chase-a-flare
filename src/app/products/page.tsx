"use client";

import { useState, useMemo } from "react";
import { Pagination } from "@/components/collection/pagination";
import { ProductList } from "@/components/collection/productList";
import { FilterCombobox } from "@/components/collection/FilterCombobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Loader2, X, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategorias } from "@/hooks/useCategorias";
import { useCoresDisponiveis } from "@/hooks/useCoresDisponiveis";
import banner2 from '@/assets/banner2.jpg';
import Image from "next/image";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filtros
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [selectedCor, setSelectedCor] = useState<string | null>(null);
  const [precoMin, setPrecoMin] = useState<string>("");
  const [precoMax, setPrecoMax] = useState<string>("");
  const [ordenacao, setOrdenacao] = useState<string>("relevance");

  // Hooks customizados
  const { categorias } = useCategorias();
  const { cores: availableColors } = useCoresDisponiveis();
  const { products, totalPages, isLoading } = useProducts({
    pageNumber: currentPage,
    pageSize: ITEMS_PER_PAGE,
    categoriaId: selectedCategoria,
    corId: selectedCor ? parseInt(selectedCor) : null,
    precoMin,
    precoMax,
    ordenacao: ordenacao !== "relevance" ? ordenacao : undefined,
  });



  // Filtrar produtos por busca local
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter((product) => 
      product.nome.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.categoriaNome.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategoria(null);
    setSelectedCor(null);
    setPrecoMin("");
    setPrecoMax("");
    setOrdenacao("relevance");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    selectedCategoria !== null ||
    selectedCor !== null ||
    precoMin !== "" ||
    precoMax !== "" ||
    ordenacao !== "relevance";

  const activeFiltersCount = [
    selectedCategoria !== null,
    selectedCor !== null,
    precoMin !== "",
    precoMax !== "",
    ordenacao !== "relevance",
  ].filter(Boolean).length;

  const categoriaOptions = [
    { label: "Todas as Categorias", value: "all" },
    ...categorias.map((cat) => ({ label: cat.nome, value: cat.id.toString() })),
  ];

  const ordenacaoOptions = [
    { label: "Relevância", value: "relevance" },
    { label: "Menor Preço", value: "preco-asc" },
    { label: "Maior Preço", value: "preco-desc" },
    { label: "Nome A-Z", value: "nome" },
    { label: "Mais Recentes", value: "mais-recente" },
  ];

  return (
    <div className="font-display bg-white pt-14 md:pt-28 min-h-screen">
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Banner */}
          <div className="mb-8 relative h-40 md:h-100 rounded-2xl overflow-hidden">
            <Image
              src={banner2}
              alt="DII Collection Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Search and Filter Button */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="w-full pl-12 pr-4 text-sm font-light transition-colors text-primary"
                placeholder="Buscar óculos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 ${
                hasActiveFilters ? "border-accent text-accent" : ""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filtros Collapse */}
          {isFilterOpen && (
            <div className="mb-8 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">Filtros</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-primary hover:text-accent"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpar tudo
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 flex flex-col">
                    <Label className="text-primary font-medium text-sm">
                      Categoria
                    </Label>
                    <FilterCombobox
                      options={categoriaOptions}
                      value={selectedCategoria?.toString() || "all"}
                      onChange={(value) =>
                        setSelectedCategoria(
                          value === "all" ? null : parseInt(value)
                        )
                      }
                      placeholder="Todas as categorias"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <Label className="text-primary font-medium text-sm">
                      Ordenar por
                    </Label>
                    <FilterCombobox
                      options={ordenacaoOptions}
                      value={ordenacao}
                      onChange={setOrdenacao}
                      placeholder="Relevância"
                    />
                  </div>
                </div>

                {/* Linha 2: Faixa de Preço */}
                <div className="space-y-1">
                  <Label className="text-primary font-medium text-sm">
                    Faixa de Preço
                  </Label>
                  <div className="flex flex-col gap-3">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={precoMin}
                      onChange={(e) => setPrecoMin(e.target.value)}
                      className="text-primary"
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={precoMax}
                      onChange={(e) => setPrecoMax(e.target.value)}
                      className="text-primary"
                    />
                  </div>
                </div>

                {/* Linha 3: Cores disponíveis */}
                {availableColors.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-primary font-medium text-sm">
                      Cores Disponíveis
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => {
                        const isSelected = selectedCor === color.id.toString();

                        return (
                          <button
                            key={color.id}
                            onClick={() =>
                              setSelectedCor(
                                isSelected ? null : color.id.toString()
                              )
                            }
                            className={`relative w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${
                              isSelected
                                ? "border-accent scale-110 shadow-lg ring-2 ring-accent ring-offset-2"
                                : "border-gray-300 hover:border-gray-400 hover:scale-105"
                            }`}
                            title={color.nome}
                          >
                            {color.hex2 ? (
                              <>
                                <div
                                  className="absolute top-0 left-0 right-0 h-1/2"
                                  style={{ backgroundColor: `#${color.hex1}` }}
                                />
                                <div
                                  className="absolute bottom-0 left-0 right-0 h-1/2"
                                  style={{ backgroundColor: `#${color.hex2}` }}
                                />
                              </>
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{ backgroundColor: `#${color.hex1}` }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Products */}
              {filteredBySearch.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? `Nenhum produto encontrado para "${searchQuery}"`
                      : "Nenhum produto disponível"}
                  </p>
                </div>
              ) : (
                <>
                  <ProductList products={filteredBySearch} />
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
