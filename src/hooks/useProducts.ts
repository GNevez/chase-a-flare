import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { Produto, UseProductsParams, UseProductsReturn } from "@/interface/produto";

export const useProducts = ({
  pageNumber,
  pageSize,
  categoriaId,
  corId,
  precoMin,
  precoMax,
  ordenacao,
}: UseProductsParams): UseProductsReturn => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });

      if (categoriaId) params.append("categoriaId", categoriaId.toString());
      if (corId) params.append("corId", corId.toString());
      if (precoMin) params.append("precoMin", precoMin);
      if (precoMax) params.append("precoMax", precoMax);
      if (ordenacao && ordenacao !== "relevance")
        params.append("ordenacao", ordenacao);

      const response = await apiRequest.get(`/api/Produto/paginated?${params}`);
      setProducts(response.data.produtos);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar produtos";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, categoriaId, corId, precoMin, precoMax, ordenacao]);

  return {
    products,
    totalPages,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
