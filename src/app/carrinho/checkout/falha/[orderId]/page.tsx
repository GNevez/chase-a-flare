"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { HelpContact } from "@/components/checkout/HelpContact";

interface OrderDetails {
  codigoPedido: string;
  status: string;
  totalPedido: number;
  metodoPagamento: string;
  dataPedido: string;
}

export default function FalhaPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiRequest.get(`/api/pedido/codigo/${orderId}`);
        setOrder(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar pedido:", error);
        setErrorMessage("Não foi possível carregar os detalhes do pedido");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleTryAgain = () => {
    router.push("/carrinho/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-display text-primary pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-display text-primary py-32">
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Ícone de falha */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 text-white rounded-full p-6">
                <XCircle className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* Título e mensagem */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Pagamento não aprovado
            </h1>
            <p className="text-lg text-neutral-600 mb-2">
              Infelizmente seu pagamento não foi aprovado.
            </p>
            {order && (
              <p className="text-sm text-neutral-500">
                Pedido: <span className="font-semibold">{order.codigoPedido}</span>
              </p>
            )}
          </div>

          {/* Possíveis motivos */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Possíveis motivos:
            </h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Saldo insuficiente ou limite excedido</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Dados do cartão incorretos ou vencido</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Cartão bloqueado ou não habilitado para compras online</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Problema de comunicação com a operadora</span>
              </li>
              {order?.metodoPagamento === "pix" && (
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>PIX expirado ou não foi pago a tempo</span>
                </li>
              )}
            </ul>
          </div>

          {/* Detalhes do pedido */}
          {order && (
            <div className="bg-neutral-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Detalhes do pedido
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Código:</span>
                  <span className="font-semibold">{order.codigoPedido}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Valor:</span>
                  <span className="font-semibold">
                    {order.totalPedido.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Forma de pagamento:</span>
                  <span className="font-semibold capitalize">
                    {order.metodoPagamento.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className="font-semibold text-red-600">
                    Pagamento Recusado
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTryAgain}
              className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar novamente
            </button>
            <Link
              href="/"
              className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao início
            </Link>
          </div>

          {/* Ajuda */}
          <HelpContact />
        </div>
      </main>
    </div>
  );
}
