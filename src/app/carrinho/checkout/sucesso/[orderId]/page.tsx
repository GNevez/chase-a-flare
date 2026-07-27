'use client';

import { useRouter, useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { CheckCircle2, Mail, Download, Package, MapPin, CreditCard, Calendar, Home } from 'lucide-react';
import Image from 'next/image';
import { getBaseURL } from "@/lib/api";

export default function SucessoPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { order, loading, error } = useOrder({ orderId });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cartao_de_credito: "Cartão de Crédito",
      cartao_de_debito: "Cartão de Débito",
      pix: "PIX",
      boleto: "Boleto",
      dinheiro: "Dinheiro",
      venda: "Venda",
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary/70">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6 border border-primary/20">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Ops! Algo deu errado
            </h1>
            <p className="text-primary/70">
              {error || "Pedido não encontrado"}
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-accent text-primary py-3 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-32 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center space-y-6 border border-primary/20">
          <div className="relative">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto border-2 border-accent/30">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <div
              className="absolute -inset-2 bg-accent/5 rounded-full animate-pulse"
              style={{ animationDuration: "2s" }}
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Pedido Confirmado!
            </h1>
            <p className="text-lg text-primary/70">
              Obrigado pela sua compra, {order.clienteNome}!
            </p>
          </div>

          <div className="bg-accent/5 rounded-xl p-6 border-2 border-accent/30">
            <p className="text-sm text-primary/70 mb-1">Número do Pedido</p>
            <p className="text-3xl font-mono font-bold text-accent">
              #{order.codigoPedido}
            </p>
            <p className="text-sm text-primary/70 mt-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              {formatDate(order.dataPedido)}
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-accent/5 rounded-xl p-6 border border-primary/10 text-left">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-2">
                  Confirmação Enviada
                </h3>
                <p className="text-sm text-primary/70 leading-relaxed mb-2">
                  Enviamos todos os detalhes do pedido para:
                </p>
                <p className="text-sm font-medium text-accent">
                  {order.clienteEmail}
                </p>
                <p className="text-xs text-primary/70 mt-2">
                  Não esqueça de verificar sua caixa de spam
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-primary/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Itens do Pedido</h2>
          </div>

          <div className="space-y-4">
            {order.itens.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors border border-primary/10"
              >
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-primary/20">
                  {item.produtoImagem ? (
                    <Image
                      src={
                        item.produtoImagem.startsWith("http")
                          ? item.produtoImagem
                          : `${getBaseURL()}${item.produtoImagem}`
                      }
                      alt={item.produtoNome}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate">
                    {item.produtoNome}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-primary/70">
                      Cor: {item.corNome}
                    </span>
                    {(item.corHex1 || item.corHex2) && (
                      <div className="flex items-center gap-1">
                        {item.corHex1 && item.corHex2 ? (
                          <div
                            className="w-5 h-5 rounded-full border-2 border-primary/20 shadow-sm overflow-hidden flex"
                            title={`${item.corHex1} / ${item.corHex2}`}
                          >
                            <div
                              className="w-1/2 h-full"
                              style={{ backgroundColor: item.corHex1 }}
                            />
                            <div
                              className="w-1/2 h-full"
                              style={{ backgroundColor: item.corHex2 }}
                            />
                          </div>
                        ) : (
                          <>
                            {item.corHex1 && (
                              <div
                                className="w-5 h-5 rounded-full border-2 border-primary/20 shadow-sm"
                                style={{ backgroundColor: item.corHex1 }}
                                title={item.corHex1}
                              />
                            )}
                            {item.corHex2 && (
                              <div
                                className="w-5 h-5 rounded-full border-2 border-primary/20 shadow-sm"
                                style={{ backgroundColor: item.corHex2 }}
                                title={item.corHex2}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-primary/70 mt-1">
                    Qtd: {item.quantidade} × {formatCurrency(item.produtoPreco)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-primary">
                    {formatCurrency(item.precoTotalItem)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-primary/20">
            <h2 className="text-xl font-bold text-primary mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-primary/70">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    order.itens.reduce(
                      (sum, item) => sum + item.precoTotalItem,
                      0
                    )
                  )}
                </span>
              </div>

              {order.descontoPorUnidade > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Desconto por Quantidade</span>
                  <span>-{formatCurrency(order.descontoPorUnidade)}</span>
                </div>
              )}

              {order.descontoCupom > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Desconto Cupom</span>
                  <span>-{formatCurrency(order.descontoCupom)}</span>
                </div>
              )}

              {order.precoFrete !== undefined && order.precoFrete !== null && (
                <div className="flex justify-between text-primary/70">
                  <span>Frete</span>
                  <span>
                    {order.precoFrete === 0
                      ? "GRÁTIS"
                      : formatCurrency(order.precoFrete)}
                  </span>
                </div>
              )}

              <div className="border-t border-primary/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    {formatCurrency(order.totalPedido)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-primary/70">Método de Pagamento</p>
                  <p className="font-semibold text-primary">
                    {getPaymentMethodLabel(order.metodoPagamento)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-primary/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-primary">
                Endereço de Entrega
              </h2>
            </div>

            <div className="space-y-2 text-primary/70">
              <p className="font-semibold text-primary">{order.clienteNome}</p>
              {order.clienteTelefone && (
                <p className="text-sm">{order.clienteTelefone}</p>
              )}
              <div className="pt-2">
                <p>
                  {order.enderecoEntrega.logradouro},{" "}
                  {order.enderecoEntrega.numero}
                </p>
                {order.enderecoEntrega.complemento && (
                  <p>{order.enderecoEntrega.complemento}</p>
                )}
                <p>{order.enderecoEntrega.bairro}</p>
                <p>
                  {order.enderecoEntrega.cidade} -{" "}
                  {order.enderecoEntrega.estado}
                </p>
                <p className="mt-2 font-mono text-sm">
                  CEP: {order.enderecoEntrega.cep}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-primary/20">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() =>
                alert(
                  "Funcionalidade de download da NF será implementada em breve"
                )
              }
              className="flex-1 flex items-center justify-center space-x-2 bg-accent text-primary py-4 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Baixar Nota Fiscal</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex-1 flex items-center justify-center space-x-2 bg-white text-primary py-4 px-6 rounded-lg font-semibold hover:bg-accent/5 transition-all border-2 border-primary/20"
            >
              <Home className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </button>
          </div>

          {order.observacoes && (
            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-sm text-primary/70 mb-2">Observações:</p>
              <p className="text-sm text-primary bg-accent/5 p-4 rounded-lg border border-primary/10">
                {order.observacoes}
              </p>
            </div>
          )}
        </div>

        {/* Thank You Message */}
        <div className="text-center py-8">
          <p className="text-primary/70 text-lg">
            Agradecemos pela sua confiança! 💛
          </p>
          <p className="text-primary/70 text-sm mt-2">
            Em caso de dúvidas, entre em contato conosco
          </p>
        </div>
      </div>
    </div>
  );
}
