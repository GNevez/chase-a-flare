import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import type { Categoria, UseCategoriasReturn } from "@/interface/categoria";

export const useCategorias = (): UseCategoriasReturn => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest.get("/api/Categoria");
        setCategorias(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar categorias";
        setError(errorMessage);
        console.error("Erro ao carregar categorias:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoading, error };
};
