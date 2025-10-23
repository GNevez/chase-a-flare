"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export type DescontoQuantidade = {
  id: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  valorPromocional: number;
  descricao?: string | null;
  ativo: boolean;
};

export function useDiscounts() {
  const [descontos, setDescontos] = useState<DescontoQuantidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescontos = async () => {
      try {
        const response = await apiRequest.get<DescontoQuantidade[]>(
          "/api/descontoquantidade"
        );
        const ativosOrdenados = response.data
          .filter((d: DescontoQuantidade) => d.ativo)
          .sort((a, b) => a.quantidadeMinima - b.quantidadeMinima);
        setDescontos(ativosOrdenados);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao buscar descontos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescontos();
  }, []);

  const getDescontoParaQuantidade = (quantidade: number): DescontoQuantidade | null => {
    return descontos.find(
      d => quantidade >= d.quantidadeMinima && quantidade <= d.quantidadeMaxima
    ) || null;
  };

  const calcularTotal = (subtotal: number, quantidade: number): { total: number; desconto: number; descontoInfo: DescontoQuantidade | null } => {
    const descontoInfo = getDescontoParaQuantidade(quantidade);
    
    if (!descontoInfo) {
      return { total: subtotal, desconto: 0, descontoInfo: null };
    }

    // O valorPromocional é o DESCONTO TOTAL a ser aplicado
    const valorDesconto = descontoInfo.valorPromocional;
    const totalComDesconto = subtotal - valorDesconto;

    return {
      total: totalComDesconto > 0 ? totalComDesconto : subtotal,
      desconto: valorDesconto,
      descontoInfo
    };
  };

  const getProximaFaixa = (quantidade: number): DescontoQuantidade | null => {
    // Considera descontos ordenados por quantidadeMinima
    for (const d of descontos) {
      if (quantidade < d.quantidadeMinima) return d;
    }
    return null;
  };

  return {
    descontos,
    loading,
    error,
    getDescontoParaQuantidade,
    calcularTotal,
    getProximaFaixa
  };
}
