"use client";

import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner"  
import { useCart } from "./useCart";

export type CupomValidado = {
  valido: boolean;
  cupomId?: number;
  codigo?: string;
  descricao?: string;
  tipoDesconto?: "percentual" | "fixo" | string;
  valorDesconto?: number; // valor em reais já calculado pelo backend
  valorFinal?: number;
  message?: string;
};

export function useCoupon() {
  const { cart, refetch } = useCart();
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados derivados do carrinho (fonte de verdade no backend)
  const couponDiscount = useMemo(() => (cart as any)?.cupomValorDesconto ?? 0, [cart]);
  const couponCode = useMemo(() => (cart as any)?.cupomCodigo ?? undefined, [cart]);

  // Mantém compatibilidade com assinatura antiga: (codigo, valorCarrinho?, usuarioId?)
  const applyCoupon = useCallback(async (codigo: string, _valorCarrinho?: number, _usuarioId?: number | null) => {
    setIsApplying(true);
    setError(null);
    try {
      const res = await apiRequest.post("/api/cart/apply-coupon", { codigo });
      await refetch();
      toast.success("Cupom aplicado com sucesso");
      return { success: true, data: res.data } as const;
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Erro ao aplicar cupom";
      toast.error(message);
      setError(message);
      return { success: false, error: message } as const;
    } finally {
      setIsApplying(false);
    }
  }, [refetch]);

  const clearCoupon = useCallback(async () => {
    setError(null);
    try {
      await apiRequest.delete("/api/cart/remove-coupon");
      await refetch();
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Erro ao remover cupom";
      setError(message);
      toast.error(message);
    }
  }, [refetch]);

  return {
    isApplying,
    error,
    couponDiscount,
    couponCode,
    applyCoupon,
    clearCoupon,
  };
}
