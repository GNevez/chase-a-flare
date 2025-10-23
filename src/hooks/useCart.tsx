'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { apiRequest as apiClient } from '@/lib/api';

export interface CartItem {
  id: number;
  produtoId: number;
  corId: number;
  quantidade: number;
  dataAdicao: string;
  produtoNome: string;
  produtoSKU: string;
  produtoPreco: number;
  produtoImagem: string;
  corNome: string;
  corHex1?: string;
  corHex2?: string;
  subtotal: number;
}

export interface Cart {
  token: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  itens: CartItem[];
  subtotal: number;
  totalItens: number;
  // Cupom aplicado pelo backend
  cupomId?: number | null;
  cupomCodigo?: string | null;
  cupomValorDesconto?: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (produtoId: number, corId: number, quantidade?: number) => Promise<any>;
  updateItemQuantity: (itemId: number, quantidade: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
  openCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Cart>('/api/cart');
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (produtoId: number, corId: number, quantidade: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<Cart>('/api/cart/add', {
        produtoId,
        corId,
        quantidade,
      });
      setCart(response.data);
      setIsCartOpen(true); 
      return response.data; 
    } catch (err: any) {
      setError(err.message);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItemQuantity = useCallback(async (itemId: number, quantidade: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<Cart>('/api/cart/update', {
        itemId,
        quantidade,
      });
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete<Cart>(`/api/cart/remove/${itemId}`);
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete<Cart>('/api/cart/clear');
      setCart(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value: CartContextType = {
    cart,
    isLoading,
    error,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
    openCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
