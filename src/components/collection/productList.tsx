"use client";
import { useState } from "react";

import { Search, Grid3X3, LayoutGrid, Rows3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

import { PropsProductsList } from "@/interface/collection/products";
import { ProductCard } from "./productCard";

const ProductList: React.FC<PropsProductsList> = ({
  setPriceRange,
  priceRange,
  colors,
  toggleColor,
  selectedColors,
  searchTerm,
  setSearchTerm,
  gridColumns,
  setGridColumns,
  getGridClass,
  filteredProducts,
}) => {
  const [sortBy, setSortBy] = useState("featured");

  const modernInput =
    "w-full rounded-xl bg-gray-100 px-4 py-2 shadow-sm focus:bg-white focus:shadow-md transition-all outline-none border-none";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filtros */}
        <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
          <h2 className="text-xl font-semibold uppercase tracking-wider">
            Filtros
          </h2>
          <div>
            <h3 className="font-semibold mb-3">Disponibilidade</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" className="rounded-md" />
                <label htmlFor="in-stock" className="text-sm">
                  Apenas Local
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" className="rounded-md" />
                <label htmlFor="out-of-stock" className="text-sm">
                  Fora de Estoque
                </label>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Preço</h3>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              max={500}
              step={10}
              className="accent-black"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Cor</h3>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`w-7 h-7 rounded-full border border-gray-300 ${
                    color.value
                  } ${
                    selectedColors.includes(color.name)
                      ? "ring-2 ring-offset-1 ring-black"
                      : ""
                  }`}
                  aria-label={`Filtrar por cor ${color.name}`}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar óculos..."
                className={`${modernInput} pl-10`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`${modernInput} w-[180px]`}>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white text-primary border-0 shadow-md rounded-xl">
                  <SelectItem value="featured">Em Destaque</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex gap-2">
                <Button
                  size="icon"
                  onClick={() => setGridColumns(2)}
                  className={`${modernInput} w-[40px] text-primary hover:bg-white focus:!bg-primary focus:!text-white hover:cursor-pointer`}
                >
                  <Rows3 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setGridColumns(3)}
                  className={`${modernInput} w-[40px] text-primary hover:bg-white focus:!bg-primary focus:!text-white hover:cursor-pointer`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setGridColumns(4)}
                  className={`${modernInput} w-[40px] text-primary hover:bg-white focus:!bg-primary focus:!text-white hover:cursor-pointer`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className={`grid gap-6 ${getGridClass()}`}>
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center col-span-full py-16">
              <p className="text-gray-500">Nenhum produto encontrado.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
