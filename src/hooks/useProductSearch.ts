import { useState } from "react";
import { apiRequest } from "@/lib/api";
import apiClient from "@/lib/api";

export type SearchProduct = {
  id: string;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
};

type ProdutoSearchDto = {
  id: number;
  nome: string;
  slug: string;
  preco: number;
  imagemPrincipal: string;
};

export function useProductSearch() {
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = async (query: string, limit = 8): Promise<SearchProduct[]> => {
    if (!query || query.trim().length < 2) return [];

    setIsSearching(true);
    try {
      const res = await apiRequest.get<ProdutoSearchDto[]>("/api/produto/search", {
        params: { q: query.trim(), limit },
      });

      const baseURL = (apiClient.defaults.baseURL || "").replace(/\/$/, "");

      return (res.data || []).map((p) => ({
        id: String(p.id),
        name: p.nome,
        price: Number(p.preco),
        slug: p.slug,
        imageUrl: p.imagemPrincipal ? `${baseURL}${p.imagemPrincipal}` : "/placeholder.svg",
      }));
    } finally {
      setIsSearching(false);
    }
  };

  return { isSearching, searchProducts };
}
