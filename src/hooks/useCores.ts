import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import type { Cor, UseCoresReturn } from "@/interface/cor";

export const useCores = (): UseCoresReturn => {
  const [cores, setCores] = useState<Cor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCores = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest.get("/api/Cor");
        setCores(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar cores";
        setError(errorMessage);
        console.error("Erro ao carregar cores:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCores();
  }, []);

  return { cores, isLoading, error };
};
