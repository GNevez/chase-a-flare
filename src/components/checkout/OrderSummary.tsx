import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderSummaryProps = {
  items: OrderItem[];
  subtotal: number;
  promotionDiscount?: number;
  couponDiscount?: number;
  couponCode?: string;
  shipping: number;
  total: number;
  onCheckout?: () => void;
  isProcessing?: boolean;
  formId?: string; // when provided, button will submit this form
};

export function OrderSummary({
  items,
  subtotal,
  promotionDiscount = 0,
  couponDiscount = 0,
  couponCode,
  shipping,
  total,
  onCheckout,
  isProcessing = false,
  formId,
}: OrderSummaryProps) {
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
            R${shipping.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
      <div className="border-t border-primary/20 my-6"></div>
      <div className="flex justify-between font-bold text-lg">
        <p>Total</p>
        <p>R${total.toFixed(2).replace(".", ",")}</p>
      </div>
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
