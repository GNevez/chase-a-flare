import apiClient from "@/lib/api";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  nome: string;
  slug: string;
  banner?: string;
  titulo?: string;
  mensagem?: string;
}

export function useAllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Category[]>("/api/Categoria");
      if (!response.data) {
        throw new Error("Erro ao buscar categorias");
      }
      setCategories(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar categorias:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erro ao buscar categorias"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
