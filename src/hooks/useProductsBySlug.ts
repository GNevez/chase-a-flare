import { useState, useEffect } from "react";
import apiClient from "@/lib/api";

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
    hex1?: string;
    hex2?: string;
    quantidadeEstoque: number;
    imagens: Array<{
      id: number;
      url: string;
    }>;
  }>;
}

interface Category {
  id: number;
  nome: string;
  slug: string;
  banner?: string;
  titulo?: string;
  mensagem?: string;
}

export function useProductsBySlug(categorySlug: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Primeiro, buscar todas as categorias para encontrar a que corresponde ao slug
        const categoriesResponse = await apiClient.get<Category[]>("/api/Categoria");
        const categories = categoriesResponse.data;
        
        // Encontrar a categoria pelo slug
        const foundCategory = categories.find(
          (cat) => cat.slug.toLowerCase() === categorySlug.toLowerCase()
        );

        if (!foundCategory) {
          throw new Error("Categoria não encontrada");
        }

        setCategory(foundCategory);

        // Buscar produtos da categoria
        const productsResponse = await apiClient.get<Product[]>(
          `/api/produto/categoria/${foundCategory.id}`
        );
        
        setProducts(productsResponse.data);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError(err.response?.data?.message || err.message || "Erro ao buscar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  return {
    products,
    category,
    isLoading,
    error,
  };
}
