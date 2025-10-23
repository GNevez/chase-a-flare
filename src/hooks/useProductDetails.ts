import { useState, useEffect } from "react";

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
      const response = await fetch(`http://localhost:5006/api/produto/detalhado/${slug}`);
      if (!response.ok) {
        throw new Error("Produto não encontrado");
      }
      const data = await response.json();
      setProduct(data);
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
