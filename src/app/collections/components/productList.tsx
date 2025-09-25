"use client"
import { useState } from 'react'

import { Search, Grid3X3, LayoutGrid, Rows3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import Image from 'next/image';

import { PropsProductsList } from "@/interface/collection/products"

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
  calculateDiscount,
}) => {
  const [sortBy, setSortBy] = useState("featured");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
          <h2 className="text-xl font-semibold uppercase tracking-wider">
            Filtros
          </h2>
          <div>
            <h3 className="font-semibold mb-3">Disponibilidade</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <label htmlFor="in-stock" className="text-sm">
                  Apenas Local
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" />
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full rounded-md border-gray-300 bg-white pl-10 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] rounded-md border-gray-300 bg-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white text-primary border-0">
                  <SelectItem value="featured">Em Destaque</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex gap-1">
                <Button
                  variant={gridColumns === 2 ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setGridColumns(2)}
                  className="rounded-md" 
                >
                  <Rows3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={gridColumns === 3 ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setGridColumns(3)}
                  className="rounded-md"
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={gridColumns === 4 ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setGridColumns(4)}
                  className="rounded-md"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className={`grid gap-6 ${getGridClass()}`}>
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden border-none shadow-none bg-transparent"
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  {product.isSale && product.originalPrice && (
                    <Badge
                      variant="none"
                      className="absolute top-3 left-3 bg-accent text-primary rounded-md"
                    >
                      -{calculateDiscount(product.originalPrice, product.price)}
                      %
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-base mb-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-center items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through">
                        R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    <span className="font-bold text-gray-800">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center col-span-full py-16">
              <p className="text-gray-500">
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;