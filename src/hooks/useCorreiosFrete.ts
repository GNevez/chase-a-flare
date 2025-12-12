import { useState } from "react";
import { apiRequest } from "@/lib/api";

export interface CalcularFreteRequest {
  cepDestino: string;
  peso: number; // kg
  altura: number; // cm
  largura: number; // cm
  comprimento: number; // cm
  valorDeclarado?: number;
  codigosServico?: string[];
  carrinhoId?: number; // Opcional, para rastreamento
}

export interface FreteOpcao {
  codigoServico: string;
  nomeServico: string;
  preco: number;
  prazoEntrega: number;
  dataPrevistaEntrega?: string;
  mensagem?: string;
  erro: boolean;
}

export function useCorreiosFrete() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opcoesFrete, setOpcoesFrete] = useState<FreteOpcao[]>([]);

  const calcularFrete = async (
    data: CalcularFreteRequest
  ): Promise<FreteOpcao[] | null> => {
    setIsCalculating(true);
    setError(null);

    try {
      const response = await apiRequest.post<FreteOpcao[]>(
        "/api/Correios/calcular-frete",
        data
      );

      const opcoesValidas = response.data.filter((op) => !op.erro);
      setOpcoesFrete(opcoesValidas);
      return opcoesValidas;
    } catch (err: any) {
      console.error("Erro ao calcular frete:", err);
      setError(err.message || "Erro ao calcular frete");
      setOpcoesFrete([]);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const limparFrete = () => {
    setOpcoesFrete([]);
    setError(null);
  };

  return {
    calcularFrete,
    limparFrete,
    opcoesFrete,
    isCalculating,
    error,
  };
}
