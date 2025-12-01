import { useEffect, useState, useCallback, useRef } from 'react';
import apiClient from '@/lib/api';

interface OrderItem {
  id: number;
  produtoId: number;
  produtoNome: string;
  produtoSlug: string;
  produtoPreco: number;
  produtoImagem: string;
  corId: number;
  corNome: string;
  corHex1?: string;
  corHex2?: string;
  quantidade: number;
  precoTotalItem: number;
}

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Order {
  id: number;
  codigoPedido: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  status: number;
  precoFrete?: number;
  totalPedido: number;
  descontoPorUnidade: number;
  descontoCupom: number;
  dataPedido: string;
  metodoPagamento: string;
  observacoes?: string;
  enderecoEntrega: Endereco;
  itens: OrderItem[];
}

interface UseOrderOptions {
  orderId: string | null;
  enabled?: boolean;
  onSuccess?: (order: Order) => void;
  onError?: (error: string) => void;
}

interface UseOrderReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrder({ 
  orderId, 
  enabled = true,
  onSuccess,
  onError 
}: UseOrderOptions): UseOrderReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar refs para callbacks para evitar dependências no useCallback
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError('ID do pedido não encontrado');
      setLoading(false);
      onErrorRef.current?.('ID do pedido não encontrado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Usar endpoint com código do pedido (UUID)
      const response = await apiClient.get(`/api/pedido/codigo/${orderId}`);
      setOrder(response.data);
      onSuccessRef.current?.(response.data);
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      const errorMessage = 'Não foi possível carregar os detalhes do pedido';
      setError(errorMessage);
      onErrorRef.current?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (enabled) {
      fetchOrder();
    }
  }, [enabled, fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

export type { Order, OrderItem, Endereco };
