import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Truck, Loader2 } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  maxParcelas?: number;
  taxaJuros?: number;
};

export type FreteOpcao = {
  codigoServico: string;
  nomeServico: string;
  preco: number;
  prazoEntrega: number;
  dataPrevistaEntrega?: string;
};

type OrderSummaryProps = {
  items: OrderItem[];
  subtotal: number;
  promotionDiscount?: number;
  couponDiscount?: number;
  couponCode?: string;
  shipping: number;
  total: number;
  installmentsSelected?: string | null;
  onCheckout?: () => void;
  isProcessing?: boolean;
  formId?: string;
  // Props para frete
  opcoesFrete?: FreteOpcao[];
  freteSelecionado?: FreteOpcao | null;
  onSelecionarFrete?: (opcao: FreteOpcao) => void;
  isCalculandoFrete?: boolean;
  cepPreenchido?: boolean;
};

export function OrderSummary({
  items,
  subtotal,
  promotionDiscount = 0,
  couponDiscount = 0,
  couponCode,
  shipping,
  total,
  installmentsSelected,
  onCheckout,
  isProcessing = false,
  formId,
  opcoesFrete = [],
  freteSelecionado,
  onSelecionarFrete,
  isCalculandoFrete = false,
  cepPreenchido = false,
}: OrderSummaryProps) {
  const availableMax = items
    .map((it) => it.maxParcelas ?? Infinity)
    .reduce((acc, v) => Math.min(acc, v), Infinity);

  const allowedInstallments = isFinite(availableMax)
    ? Math.max(1, availableMax)
    : 1;

  const parcelasNum = (() => {
    if (!installmentsSelected) return allowedInstallments;
    const m = installmentsSelected.match(/^\s*(\d+)/);
    return m ? Math.max(1, parseInt(m[1], 10)) : allowedInstallments;
  })();

  const cartMaxTaxa = items.length
    ? Math.max(...items.map((it) => it.taxaJuros ?? 0))
    : 0;
  const taxaUsada = parcelasNum > 1 ? cartMaxTaxa : 0;

  const itemsTotal = subtotal;
  const baseTotal = Math.max(
    0,
    itemsTotal + shipping - (promotionDiscount ?? 0) - (couponDiscount ?? 0)
  );

  const totalWithInterest =
    itemsTotal * (1 + taxaUsada) +
    shipping -
    (promotionDiscount ?? 0) -
    (couponDiscount ?? 0);
  const interestAmount = Math.max(0, totalWithInterest - baseTotal);
  const perInstallment =
    parcelasNum > 0 ? totalWithInterest / parcelasNum : totalWithInterest;
  const hasInterest = (taxaUsada ?? 0) > 0;
  const displayTotal = hasInterest ? totalWithInterest : baseTotal;

  return (
    <div className="bg-background-light border border-neutral-200 rounded-xl p-6 sticky my-12 top-46">
      <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url("${item.image}")` }}
            ></div>
            <div className="flex-grow">
              <p className="font-medium text-sm text-neutral-800">
                {item.name}
              </p>
              <p className="text-xs text-neutral-500">Qtd: {item.quantity}</p>
            </div>
            <p className="font-medium text-sm text-neutral-800">
              R${item.price.toFixed(2).replace(".", ",")}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-primary/20 my-6"></div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <p className="text-neutral-500">Subtotal</p>
          <p className="font-medium text-neutral-800">
            R${subtotal.toFixed(2).replace(".", ",")}
          </p>
        </div>
        {promotionDiscount > 0 && (
          <div className="flex justify-between">
            <p className="text-neutral-500">Desconto da promoção</p>
            <p className="font-medium text-green-600">
              - R${promotionDiscount.toFixed(2).replace(".", ",")}
            </p>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <p className="text-neutral-500">
              Cupom{couponCode ? ` (${couponCode})` : ""}
            </p>
            <p className="font-medium text-green-600">
              - R${couponDiscount.toFixed(2).replace(".", ",")}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-neutral-500">Frete</p>
          <p className="font-medium text-neutral-800">
            {freteSelecionado
              ? `R$${freteSelecionado.preco.toFixed(2).replace(".", ",")}`
              : `R$${shipping.toFixed(2).replace(".", ",")}`}
          </p>
        </div>

        {/* Seleção de Frete */}
        {cepPreenchido && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-neutral-700 font-medium">
              <Truck className="w-4 h-4" />
              <span>Opções de Envio</span>
            </div>

            {isCalculandoFrete ? (
              <div className="flex items-center justify-center gap-2 py-4 text-neutral-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Calculando frete...</span>
              </div>
            ) : opcoesFrete.length > 0 ? (
              <div className="space-y-2">
                {opcoesFrete.map((opcao) => {
                  const isSelected =
                    freteSelecionado?.codigoServico === opcao.codigoServico;
                  const dataEntrega = opcao.dataPrevistaEntrega
                    ? new Date(opcao.dataPrevistaEntrega).toLocaleDateString(
                        "pt-BR",
                        { day: "2-digit", month: "2-digit" }
                      )
                    : null;

                  return (
                    <label
                      key={opcao.codigoServico}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="frete"
                          checked={isSelected}
                          onChange={() => onSelecionarFrete?.(opcao)}
                          className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <div>
                          <p className="font-medium text-sm text-neutral-800">
                            {opcao.nomeServico}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {opcao.prazoEntrega}{" "}
                            {opcao.prazoEntrega === 1
                              ? "dia útil"
                              : "dias úteis"}
                            {dataEntrega && ` • até ${dataEntrega}`}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-neutral-800">
                        R${opcao.preco.toFixed(2).replace(".", ",")}
                      </p>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 py-2">
                Preencha o CEP para calcular o frete
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-primary/20 my-6"></div>
      {installmentsSelected && parcelasNum > 1 ? (
        <>
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>R${displayTotal.toFixed(2).replace(".", ",")}</p>
          </div>
          <p className="text-end text-sm">
            em {parcelasNum}x {hasInterest ? "c/ juros" : "sem juros"}
          </p>
        </>
      ) : (
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>R${total.toFixed(2).replace(".", ",")}</p>
        </div>
      )}
      <Button
        type="submit"
        form={formId}
        disabled={isProcessing}
        className="cursor-pointer w-full mt-6 mb-3 bg-accent text-background-dark font-bold text-lg py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? "Processando..." : "Finalizar Pedido"}
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Link href="/carrinho" className="flex-1 ">
        <button
          type="button"
          className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Retornar ao Carrinho
        </button>
      </Link>
    </div>
  );
}
