"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Trash2, Plus, Minus } from "lucide-react";
import initialProducts from "@/hooks/temp-data/products.json"; 
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";

import recommendedProducts from "@/hooks/temp-data/recommendedProducts.json";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"], // '300' é o peso 'light'
  variable: "--font-plus-jakarta-sans", // Cria uma variável CSS para usar no Tailwind
});

export function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    return initialProducts.map(product => ({ ...product, quantity: 1 }));
  });

  const itemCount = cartItems.length;
  const subtotal = cartItems.reduce((acc, product) => acc + (product.price * product.quantity), 0);

  const handleQuantityChange = (productId: number, amount: number) => {
    setCartItems(currentItems => {
      const updatedItems = currentItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  return (
    <Sheet>
      <SheetTrigger asChild className={plusJakartaSans.variable}>
        <Button
          size="icon"
          className="relative bg-transparent hover:bg-accent hover:text-primary text-white hover-glow cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5 " />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* LARGURA AUMENTADA AQUI */}
      <SheetContent
        className={
          plusJakartaSans.variable +
          "w-full max-w-2xl bg-white dark:bg-primary shadow-2xl flex flex-col font-display p-0"
        }
      >
        <SheetHeader className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-row justify-between items-center space-y-0">
          <SheetTitle className="text-2xl font-normal text-primary dark:text-white">
            Seu carrinho
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary dark:text-white rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {itemCount === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center p-6">
              <ShoppingCart
                size={64}
                className="text-gray-300 dark:text-gray-600"
              />
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-primary dark:text-white">
                  Seu carrinho está vazio
                </h3>
                <p className="text-primary/60 dark:text-white/60">
                  Adicione alguns óculos para começar!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center text-center text-xs text-primary dark:text-white">
                  <div className="flex-1 flex flex-col items-center relative">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center font-bold text-primary">
                      1
                    </div>
                    <p className="mt-2">2 por R$199</p>
                    <div className="absolute top-3 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-white/20 -z-10"></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center relative">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/20 flex items-center justify-center"></div>
                    <p className="mt-2 opacity-60">3 por R$299</p>
                    <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/20 -z-10"></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/20 flex items-center justify-center"></div>
                    <p className="mt-2 opacity-60">4 por R$399</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {cartItems.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div
                      className="w-24 h-24 bg-cover bg-center rounded-xl"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-normal text-primary dark:text-white text-lg">
                        {product.name}
                      </h3>
                      <p className="font-medium text-primary dark:text-white mt-1">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 border border-slate-200 dark:border-white/20 rounded-md">
                        <Button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary dark:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-primary dark:text-white">
                          {product.quantity}
                        </span>
                        <Button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary dark:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleRemoveItem(product.id)}
                        size="icon"
                        variant="ghost"
                        className="text-primary/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {itemCount > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-normal text-primary dark:text-white mb-4">
              Você também pode gostar
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {recommendedProducts.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-32">
                  <div
                    className="w-full h-32 bg-cover bg-center rounded-xl mb-2"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  ></div>
                  <p className="text-sm text-primary dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-sm font-medium text-primary dark:text-white">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center my-4">
              <span className="text-lg font-normal text-primary dark:text-white">
                Subtotal
              </span>
              <span className="text-xl font-medium text-primary dark:text-white">
                R$ {subtotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Link href="/carrinho">
              <SheetClose asChild>
                <Button className="w-full cursor-pointer bg-accent text-primary font-medium py-4 h-auto text-base rounded-xl hover:bg-accent/90 transition-colors duration-300">
                  Finalizar compra
                </Button>
              </SheetClose>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}