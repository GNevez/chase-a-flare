import Link from "next/link";
import { Button } from "../ui/button";

// @/components/checkout/OrderSummary.tsx
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
  shipping: number;
  total: number;
};

export function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
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
      <Link href="#">
        <Button className="cursor-pointer w-full mt-6 bg-accent text-background-dark font-bold text-lg py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
          Finalizar Pedido
        </Button>
      </Link>
    </div>
  );
}
