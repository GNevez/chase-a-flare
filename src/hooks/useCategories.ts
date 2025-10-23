import { useState, useEffect } from "react";

interface Category {
  id: number;
  nome: string;
  slug: string;
  banner?: string;
  titulo?: string;
  mensagem?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5006/api/Categoria");
      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }
      const data = await response.json();
      // Pegar apenas 5 categorias aleatórias
      const shuffled = data.sort(() => 0.5 - Math.random());
      setCategories(shuffled.slice(0, 5));
    } catch (err: any) {
      console.error("Erro ao buscar categorias:", err);
      setError(err.message);
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
