import { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string | StaticImageData;
  imageHover?: string | StaticImageData;
  installments?: string;
  colors: string[];
  category: number;
  isNew?: boolean;
  isSale?: boolean;
  slug?: string;
}

type GridColumns = 2 | 3 | 4;

interface Category {
  id: number;
  name: string;
}

interface ColorOption {
  name: string;
  value: string;
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
}

export type { Product, GridColumns, ColorOption, PropsProductsList, Category };
