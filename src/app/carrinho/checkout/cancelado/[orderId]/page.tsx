"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Ban, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { HelpContact } from "@/components/checkout/HelpContact";

interface OrderDetails {
  codigoPedido: string;
  status: string;
  totalPedido: number;
  metodoPagamento: string;
  dataPedido: string;
  motivoCancelamento?: string;
}

export default function CanceladoPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiRequest.get(`/api/pedido/codigo/${orderId}`);
        setOrder(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar pedido:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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
          {/* Ícone de cancelamento */}
          <div className="flex justify-center mb-8">
            <div className="bg-orange-500 text-white rounded-full p-6">
              <Ban className="w-16 h-16" />
            </div>
          </div>

          {/* Título e mensagem */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Pedido Cancelado
            </h1>
            <p className="text-lg text-neutral-600 mb-2">
              Este pedido foi cancelado.
            </p>
            {order && (
              <p className="text-sm text-neutral-500">
                Pedido: <span className="font-semibold">{order.codigoPedido}</span>
              </p>
            )}
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
                  <span className="font-semibold text-orange-600">
                    Cancelado
                  </span>
                </div>
                {order.motivoCancelamento && (
                  <div className="pt-3 border-t border-neutral-200">
                    <span className="text-neutral-600 block mb-1">Motivo:</span>
                    <span className="text-neutral-800">{order.motivoCancelamento}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações sobre reembolso */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Sobre o reembolso
                </h3>
                <p className="text-sm text-neutral-700">
                  {order?.metodoPagamento === "pix" ? (
                    <>
                      Se o pagamento PIX foi realizado, o reembolso será processado 
                      automaticamente em até 7 dias úteis na conta de origem.
                    </>
                  ) : (
                    <>
                      Se o pagamento foi processado, o reembolso será feito no cartão 
                      utilizado em até 2 faturas, conforme política da operadora.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/carrinho/checkout"
              className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Fazer novo pedido
            </Link>
            <Link
              href="/"
              className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao início
            </Link>
          </div>

          {/* Ajuda */}
          <HelpContact message="Dúvidas sobre o cancelamento?" />
        </div>
      </main>
    </div>
  );
}
