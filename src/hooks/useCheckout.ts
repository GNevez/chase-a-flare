"use client";

import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/api";

export type CheckoutPayload = {
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  metodoPagamento: string;
  precoFrete: number | null;
  observacoes: string | null;
  descontoPorUnidade?: number;
  descontoCupom?: number;
  // total calculado no frontend (inclui juros/frete/descontos) para validação no backend
  totalEnviado?: number;
  // número de parcelas selecionado no frontend
  parcelasNum?: number;
};

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (payload: CheckoutPayload) => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await apiRequest.post("/api/checkout", payload, {
      });
      return { success: true, data: res.data } as const;
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Erro no checkout";
      setError(message);
      return { success: false, error: message } as const;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { isProcessing, error, createOrder };
}
