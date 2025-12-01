import { useState } from "react";
import { apiRequest } from "@/lib/api";

interface CreateOrderPayload {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  metodoPagamento: string;
  precoFrete: number;
  totalEnviado: number;
  parcelasNum: number;
  observacoes?: string | null;
  descontoPorUnidade: number;
  descontoCupom: number;
  atualizarCliente: boolean;
  cardToken?: string | null;
}

interface CreateOrderResponse {
  orderId: string;
  orderCode: string;
  status: string;
  pix?: {
    qr_code: string;
    qr_code_url: string;
  };
}

export function usePagarme() {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPublicKey = async (): Promise<string | null> => {
    try {
      const response = await apiRequest.get("/api/payments/public-key");
      return response.data.publicKey;
    } catch (error: any) {
      console.error("Erro ao buscar chave pública:", error);
      setError(error.message);
      return null;
    }
  };

  const createOrder = async (
    payload: CreateOrderPayload
  ): Promise<CreateOrderResponse | null> => {
    setIsCreatingOrder(true);
    setError(null);

    try {
      const response = await apiRequest.post("/api/payments/create-order", payload);
      
      return {
        orderId: response.data.orderId,
        orderCode: response.data.orderCode,
        status: response.data.status,
        pix: response.data.pix,
      };
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      setError(error.response?.data?.message || error.message);
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const getOrderStatus = async (orderId: string): Promise<any | null> => {
    try {
      const response = await apiRequest.get(`/api/payments/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar status:", error);
      setError(error.response?.data?.message || error.message);
      return null;
    }
  };

  return {
    isCreatingOrder,
    error,
    getPublicKey,
    createOrder,
    getOrderStatus,
  };
}
