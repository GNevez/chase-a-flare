"use client";

import { useState } from "react";

import bannerImage from "@/assets/glasses-banner.jpg"; // Certifique-se que o caminho está correto
import Image from "next/image";
import tst from "@/assets/tst.png";

import ProductList from "../../../components/collection/productList";

import {
  Product,
  GridColumns,
  PropsProductsList,
} from "@/interface/collection/products";

import categoriesData from "@/hooks/temp-data/categories.json";
import productsData from "@/hooks/temp-data/products.json";
import { PromoBar } from "@/components/PromoBar";

const Collection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState<GridColumns>(3);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const products: Product[] = productsData;

  const colors = [
    { name: "bege", value: "bg-yellow-100" },
    { name: "branco", value: "bg-white" },
    { name: "azul", value: "bg-blue-500" },
    { name: "dourado", value: "bg-yellow-500" },
    { name: "cinza", value: "bg-gray-400" },
    { name: "marrom", value: "bg-amber-700" },
    { name: "preto", value: "bg-black" },
    { name: "laranja", value: "bg-orange-500" },
    { name: "rosa", value: "bg-pink-400" },
    { name: "prata", value: "bg-slate-300" },
    { name: "tartaruga", value: "bg-yellow-900" },
    { name: "verde", value: "bg-green-600" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesColor =
      selectedColors.length === 0 ||
      product.colors.some((color) => selectedColors.includes(color));

    return matchesSearch && matchesPrice && matchesColor;
  });

  const getGridClass = () => {
    switch (gridColumns) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  

  const propsProductsList: PropsProductsList = {
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
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Banner */}
      <div className="relative h-[300px] md:h-[450px] lg:h-[600px] overflow-hidden">
        <Image
          src={bannerImage}
          alt="Coleção de Óculos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Coleção Premium
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Descubra os melhores óculos para seu estilo
            </p>
          </div>
        </div>
      </div>
      <PromoBar />
      <ProductList {...propsProductsList} />
    </div>
  );
};

export default Collection;
