import { useState } from "react";
import { apiRequest } from "@/lib/api";

interface ClienteExistente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

export function useClienteVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const verificarCpf = async (
    cpf: string
  ): Promise<ClienteExistente | null> => {
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      return null;
    }

    setIsVerifying(true);
    try {
      const cpfLimpo = cpf.replace(/\D/g, "");
      const response = await apiRequest.get<ClienteExistente>(
        `/api/cliente/verificar-cpf/${cpfLimpo}`
      );

      return response.data || null;
    } catch (error: any) {
      // 404 significa que não existe
      if (error.response?.status === 404) {
        return null;
      }
      // Outros erros são propagados
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verificarCpf,
    isVerifying,
  };
}
