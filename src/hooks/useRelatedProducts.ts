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

export function useRelatedProducts(categoryId: number, currentProductId: number, maxProducts: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId || !currentProductId) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. Buscar produtos da mesma categoria
        const categoryResponse = await apiClient.get<Product[]>(
          `/api/produto/categoria/${categoryId}`
        );
        
        // Filtrar o produto atual
        let relatedProducts = categoryResponse.data.filter(
          (p) => p.id !== currentProductId
        );

        // 2. Se tiver menos que maxProducts, buscar de outras categorias
        if (relatedProducts.length < maxProducts) {
          try {
            // Buscar todas as categorias
            const categoriesResponse = await apiClient.get<{ id: number }[]>(
              "/api/Categoria"
            );
            const otherCategories = categoriesResponse.data
              .map((cat) => cat.id)
              .filter((id) => id !== categoryId);

            // Buscar produtos de outras categorias até completar maxProducts
            const needed = maxProducts - relatedProducts.length;
            let additionalProducts: Product[] = [];

            for (const catId of otherCategories) {
              if (additionalProducts.length >= needed) break;

              try {
                const otherCatResponse = await apiClient.get<Product[]>(
                  `/api/produto/categoria/${catId}`
                );
                
                // Filtrar produtos que já estão na lista e o produto atual
                const filtered = otherCatResponse.data.filter(
                  (p) =>
                    p.id !== currentProductId &&
                    !relatedProducts.some((rp) => rp.id === p.id) &&
                    !additionalProducts.some((ap) => ap.id === p.id)
                );

                additionalProducts = [...additionalProducts, ...filtered];
              } catch (err) {
                // Ignorar erros de categorias individuais
                console.warn(`Erro ao buscar categoria ${catId}:`, err);
              }
            }

            // Adicionar produtos de outras categorias (limitando ao necessário)
            relatedProducts = [
              ...relatedProducts,
              ...additionalProducts.slice(0, needed),
            ];
          } catch (err) {
            console.warn("Erro ao buscar categorias adicionais:", err);
          }
        }

        // 3. Limitar ao máximo de produtos e randomizar
        const shuffled = relatedProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, maxProducts));
      } catch (err: any) {
        console.error("Erro ao buscar produtos relacionados:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erro ao buscar produtos relacionados"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId, maxProducts]);

  return {
    products,
    isLoading,
    error,
  };
}
