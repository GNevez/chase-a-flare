import { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string | StaticImageData;
  colors: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

type GridColumns = 2 | 3 | 4;

interface ColorOption {
  name: string;
  value: string; // classe tailwind, ex: "bg-blue-500"
}

interface PropsProductsList {
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  priceRange: [number, number];
  colors: ColorOption[];
  toggleColor: (colorName: string) => void;
  selectedColors: string[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  gridColumns: GridColumns;
  setGridColumns: React.Dispatch<React.SetStateAction<GridColumns>>;
  getGridClass: () => string;
  filteredProducts: Product[];
  calculateDiscount: (original: number, sale: number) => number;
}

export type { Product, GridColumns, ColorOption, PropsProductsList };
