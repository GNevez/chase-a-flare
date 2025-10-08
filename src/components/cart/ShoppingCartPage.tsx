// @/components/cart/ShoppingCartPage.tsx
"use client";

import { useState } from "react";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import Link from "next/link";
import { Button } from "../ui/button";

// Dados de exemplo
const initialCartItems = [
  {
    id: 1,
    name: "Armação de Óculos - Modelo A",
    price: 129.0,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg0hQ88WrI5PVCXBqZuGDJuqJDd9SK9KmFTRNmW0MKI66DHxc4Iceu8orIcL6xRyykATZaBxZxJ5QuFJ17YAI6rdODB_MbZYm5wNFNvhx-89BQZSd13vV4bREINh2LuBRUWahkH3e_HEWQvcBTmPX0_c_-HwmvjMHL0in9-RtyZu0GZdHph1nvMfKYMM69obTIvXPDPIZiezuQHMgZUXGzjuTiKYn1u-Il5xutIZdV7eEpXrD1O4GGiHWF-XDAJYTIzE-b_6P4Di4",
  },
  {
    id: 2,
    name: "Armação de Óculos - Modelo B",
    price: 129.0,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4uUn9mZ77hiLODs8JQtdrTkRb_Qu8qzn0AoTo-RmBV9eGsI9saA50Sn3WWftPw_rAaVw8iOKpSlzYFPfb1jIW-jRjczsBMOqjdje5RLCYfB_lKigXq4dKe2d7U-Oc-6REeqNXZtabYLsnJ2cGc6TSooiluj1rODAS7g0v3Iblcfv8FpRUorZ1cLWR7mYjRibnIPljxSMGQsFicti8w2iMj3d6HzfvBMQg2Lygv0ULdMyPIFss94q4zABRjsfDE1Noy6I3DKGGWFI",
  },
];

export function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = 59.0;
  const total = subtotal - discount;

  return (
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm font-light text-neutral-500 mb-4">
            <Link className="hover:text-primary" href="/">
              Home
            </Link>
            <span> / </span>
            <span className="text-neutral-800 font-medium">Carrinho</span>
          </nav>
          <h2 className="text-4xl font-normal mb-8">Carrinho de Compras</h2>

          {/* --- MODIFICAÇÃO DO BANNER --- */}
          <div className="group mb-8 cursor-pointer rounded-xl relative overflow-hidden text-white p-8 flex flex-col justify-end min-h-[250px]">
            {/* Div para a imagem de fundo com animação */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAavJIBgKuHMOUCfJv0o3oPanVUHn8qu69sGNjTsKBqsmyF4BmGrf4KifJks0wzRex5xNFbsPfRaGnat8lvCFSKf-IsHs0EEGw21XvJE_6ZW--LsCbbABoxSScm0LRHaQK7X1gH2iEO-AGLDyEblrA9YnPDNoezDkQqEnFmSIK9wcj8QiB75WVaCNbrd-PXM73D6T__7yV6b_3W6KceD4eXz4j_65SQDkXoR1awLiMSd-d6esdarB9ROFHMCy-aXIXp6HYteytgYlA")`,
              }}
            />
            {/* Conteúdo do banner posicionado acima da imagem */}
            <div className="relative z-10">
              <h3 className="text-3xl font-normal">2 por R$199</h3>
              <p className="mt-2 text-lg font-light">
                Adicione mais um item e aproveite a oferta!
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
            {/* Cabeçalho da Lista de Produtos (Cor da borda ajustada) */}
            <div className="grid grid-cols-12 gap-4 items-center px-6 py-4 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <div className="col-span-6">Produto</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Quantidade</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Lista de Produtos */}
            {cartItems.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                isLastItem={index === cartItems.length - 1}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cupom de Desconto</h3>
              <div className="flex gap-2">
                <input
                  className="flex-grow form-input bg-white border border-slate-300 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Insira seu cupom"
                  type="text"
                />
                <button className="cursor-pointer bg-transparent text-background-dark font-bold text-lg py-2 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                  Aplicar
                </button>
              </div>
            </div>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping="Grátis"
              total={total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
