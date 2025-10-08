import Link from "next/link";
import { Button } from "../ui/button";

// @/components/cart/OrderSummary.tsx
type OrderSummaryProps = {
  subtotal: number;
  discount: number;
  shipping: string;
  total: number;
};

export function OrderSummary({
  subtotal,
  discount,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
      <div className="space-y-3 text-background-dark/80 dark:text-background-light/80">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R${subtotal.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between">
          <span>Desconto da promoção</span>
          <span className="text-green-600 dark:text-green-400">
            - R${discount.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span>{shipping}</span>
        </div>
        <div className="border-t border-background-dark/10 dark:border-background-light/10 my-3"></div>
        <div className="flex justify-between text-lg font-bold text-background-dark dark:text-background-light">
          <span>Total</span>
          <span>R${total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
      <Link href="carrinho/checkout">
        <Button className="cursor-pointer w-full mt-6 bg-accent text-background-dark font-bold text-lg py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
          Finalizar Compra
        </Button>
      </Link>
    </div>
  );
}
