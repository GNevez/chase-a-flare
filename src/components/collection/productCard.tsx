import { CreditCard, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/interface/collection/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col text-background-dark dark:text-background-light">
      <div className="relative w-full overflow-hidden rounded-lg bg-background-dark/5 dark:bg-background-light/5">
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        {/* Botão corrigido para a DIREITA */}
        <button className="cursor-pointer absolute gap-1 bottom-4 right-4 flex h-10 py-6 px-4 items-center justify-center bg-white/70 text-primary text-sm font-normal rounded-full opacity-95 hover:opacity-100 transition-all duration-300 scale-95 hover:scale-100">
          <Plus className="w-4 h-4" />
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-4 text-left">
        <p className="font-medium text-primary">{product.name}</p>

        <div className="flex items-center gap-2">
          <p className="text-primary text-base font-bold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          {product.originalPrice && (
            <p className="text-primary/70 text-sm line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </p>
          )}
        </div>

        {product.installments && (
          <div className="flex items-center gap-1 text-primary/70 mt-1">
            <CreditCard className="h-4 w-4" />
            <p className="text-xs font-light ">{product.installments}</p>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full overflow-hidden flex border border-black/10">
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: product.colors[0] }}
              ></div>
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: product.colors[1] }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
