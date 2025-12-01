import { useState, useEffect } from "react";
import apiClient from "@/lib/api";

interface ProductDetails {
  id: number;
  nome: string;
  sku: string;
  codigoExterno?: string;
  fabricante?: string;
  slug: string;
  preco: number;
  precoOriginal?: number;
  isSale: boolean;
  isNew: boolean;
  imagemPrincipal: string;
  imagemHover?: string;
  maxParcelas: number;
  taxaJuros: number;
  descricao?: string;
  categoriaId: number;
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

export function useProductDetails(slug: string) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ProductDetails>(
        `/api/produto/detalhado/${slug}`
      );
      setProduct(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar produto:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}
