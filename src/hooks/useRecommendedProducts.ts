"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export type ProdutoRecomendado = {
  id: number;
  nome: string;
  slug: string;
  preco: number;
  coresDisponiveis: Array<{
    id: number;
    nome: string;
    hex: string;
    quantidadeEstoque: number;
    imagens: Array<{
      id: number;
      url: string;
    }>;
   }>;
  imagemPrincipal: string;
};

export function useRecommendedProducts(limit: number = 5) {
  const [produtos, setProdutos] = useState<ProdutoRecomendado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await apiRequest.get<any[]>("/api/produto");
        
        // Pegar produtos aleatórios
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, limit);
        
        setProdutos(selected.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          slug: p.slug,
          preco: p.preco,
          coresDisponiveis: p.coresDisponiveis,
          imagemPrincipal: p.imagemPrincipal,
        })));
        setError(null);
      } catch (err: any) {
        console.error("Erro ao buscar produtos recomendados:", err);
        setError(err.message);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [limit]);

  return {
    produtos,
    loading,
    error,
  };
}
