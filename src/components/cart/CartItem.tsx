// @/components/cart/CartItem.tsx
"use client";

import { Trash2 } from "lucide-react"; // Importe o ícone

type CartItemProps = {
  item: {
    id: number;
    name: string;
    price: number; // preço efetivo (após descontos)
    originalPrice?: number; // preço original unitário
    quantity: number;
    image: string;
    color?: string;
  };
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
  isLastItem: boolean;
};

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isLastItem,
}: CartItemProps) {
  const totalItemPrice = item.price * item.quantity;
  const originalTotal = (item.originalPrice ?? item.price) * item.quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onQuantityChange(item.id, isNaN(value) ? 0 : value);
  };

  return (
    // --- MODIFICAÇÃO DA BORDA ---
    // A cor da borda foi trocada para `border-slate-200`
    <div
      className={`grid grid-cols-12 gap-4 items-center p-6 text-primary ${
        !isLastItem ? "border-b border-slate-200" : ""
      }`}
    >
      <div className="col-span-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url("${item.image}")` }}
        ></div>
        <div>
          <p className="font-bold text-slate-800">{item.name}</p>
          {item.color && (
            <p className="text-sm text-slate-500">Cor: {item.color}</p>
          )}
          {/* --- MODIFICAÇÃO DO BOTÃO REMOVER --- */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
      <div className="col-span-2 text-center font-medium text-slate-700">
        {item.originalPrice && item.originalPrice > item.price ? (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-xs text-slate-400 line-through">
              R${item.originalPrice.toFixed(2).replace(".", ",")}
            </span>
            <span>R${item.price.toFixed(2).replace(".", ",")}</span>
          </div>
        ) : (
          <span>R${item.price.toFixed(2).replace(".", ",")}</span>
        )}
      </div>
      <div className="col-span-2 flex justify-center">
        <input
          className="w-16 text-center bg-white border border-slate-300 rounded-md py-1"
          type="number"
          value={item.quantity}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <div className="col-span-2 text-right font-bold text-slate-800">
        {originalTotal > totalItemPrice ? (
          <div className="flex flex-col items-end leading-tight">
            <span className="text-xs text-slate-400 line-through font-normal">
              R${originalTotal.toFixed(2).replace(".", ",")}
            </span>
            <span>R${totalItemPrice.toFixed(2).replace(".", ",")}</span>
          </div>
        ) : (
          <span>R${totalItemPrice.toFixed(2).replace(".", ",")}</span>
        )}
      </div>
    </div>
  );
}
