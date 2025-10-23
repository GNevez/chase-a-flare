import { useState, useEffect } from "react";

interface Product {
  id: number;
  nome: string;
  sku: string;
  slug: string;
  preco: number;
  precoOriginal?: number;
  isSale?: boolean;
  isNew?: boolean;
  imagemPrincipal: string;
  imagemHover?: string;
  categoriaNome: string;
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
}

export function useProductsByCategory(categoryId: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (id: number) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5006/api/produto/categoria/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos da categoria");
      }
      const data = await response.json();
      // Pegar apenas 10 produtos aleatórios
      const shuffled = data.sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 10));
    } catch (err: any) {
      console.error("Erro ao buscar produtos:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId]);

  return {
    products,
    isLoading,
    error,
    refetch: () => fetchProducts(categoryId),
  };
}
