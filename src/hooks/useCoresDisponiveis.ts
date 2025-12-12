import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import type { CorDisponivel, UseCoresDisponiveisReturn } from "@/interface/corDisponivel";

export const useCoresDisponiveis = (): UseCoresDisponiveisReturn => {
  const [cores, setCores] = useState<CorDisponivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCores = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest.get("/api/Produto/cores-disponiveis");
        setCores(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar cores";
        setError(errorMessage);
        console.error("Erro ao carregar cores disponíveis:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCores();
  }, []);

  return { cores, isLoading, error };
};
