// @/components/cart/ShoppingCartPage.tsx
"use client";

import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useDiscounts } from "@/hooks/useDiscounts";
import { useCoupon } from "@/hooks/useCoupon";
import { useEffect, useState } from "react";

export function ShoppingCartPage() {
  const { cart, isLoading, updateItemQuantity, removeItem } = useCart();
  const {
    descontos,
    loading: loadingDescontos,
    calcularTotal,
    getProximaFaixa,
  } = useDiscounts();
  const { applyCoupon, clearCoupon, couponDiscount, couponCode, isApplying } =
    useCoupon();
  const [couponInput, setCouponInput] = useState("");

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
  };

  const itemCount = cart?.totalItens || 0;
  const subtotal = cart?.subtotal || 0;

  const {
    total,
    desconto: discount,
    descontoInfo,
  } = calcularTotal(subtotal, itemCount);

  // Encontrar a próxima faixa de desconto
  const proximaFaixa = getProximaFaixa(itemCount);
  const faixaAtual = descontoInfo;

  const totalComCupom = Math.max(0, total - couponDiscount);

  const onApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    await applyCoupon(couponInput.trim(), total);
  };

  const onClearCoupon = () => {
    clearCoupon();
    setCouponInput("");
  };

  // Revalidar cupom automaticamente quando o total (antes do cupom) mudar
  useEffect(() => {
    if (couponCode) {
      applyCoupon(couponCode, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

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

          {/* --- BANNER PROMOCIONAL DINÂMICO --- */}
          {!loadingDescontos && proximaFaixa && itemCount > 0 && (
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
                <h3 className="text-3xl font-normal">
                  Desconto de R${proximaFaixa.valorPromocional.toFixed(0)} em{" "}
                  {proximaFaixa.quantidadeMinima} itens!
                </h3>
                <p className="mt-2 text-lg font-light">
                  Adicione mais {proximaFaixa.quantidadeMinima - itemCount}{" "}
                  {proximaFaixa.quantidadeMinima - itemCount === 1
                    ? "item"
                    : "itens"}{" "}
                  e ganhe esse desconto!
                </p>
              </div>
            </div>
          )}

          {!loadingDescontos && faixaAtual && !proximaFaixa && (
            <div className="group mb-8 cursor-pointer rounded-xl relative overflow-hidden text-white p-8 flex flex-col justify-end min-h-[250px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAavJIBgKuHMOUCfJv0o3oPanVUHn8qu69sGNjTsKBqsmyF4BmGrf4KifJks0wzRex5xNFbsPfRaGnat8lvCFSKf-IsHs0EEGw21XvJE_6ZW--LsCbbABoxSScm0LRHaQK7X1gH2iEO-AGLDyEblrA9YnPDNoezDkQqEnFmSIK9wcj8QiB75WVaCNbrd-PXM73D6T__7yV6b_3W6KceD4eXz4j_65SQDkXoR1awLiMSd-d6esdarB9ROFHMCy-aXIXp6HYteytgYlA")`,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-3xl font-normal">
                  🎉 Máximo desconto ativado!
                </h3>
                <p className="mt-2 text-lg font-light">
                  Você está economizando R$
                  {discount.toFixed(2).replace(".", ",")} com essa compra!
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
            {/* Cabeçalho da Lista de Produtos (Cor da borda ajustada) */}
            <div className="grid grid-cols-12 gap-4 items-center px-6 py-4 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <div className="col-span-6">Produto</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Quantidade</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Lista de Produtos */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : cart?.itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-primary/60 mb-4">
                  Adicione alguns óculos para começar!
                </p>
                <Link href="/">
                  <button className="bg-accent text-primary font-medium py-2 px-6 rounded-lg hover:bg-accent/90 transition-colors">
                    Continuar comprando
                  </button>
                </Link>
              </div>
            ) : (
              cart?.itens.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.produtoNome,
                    price: item.produtoPreco,
                    quantity: item.quantidade,
                    image: `http://localhost:5006${item.produtoImagem}`,
                    color: item.corNome,
                  }}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  isLastItem={index === (cart?.itens.length || 0) - 1}
                />
              ))
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cupom de Desconto</h3>
              <div className="flex gap-2 items-center">
                <input
                  className="flex-grow form-input bg-white border border-slate-300 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Insira seu cupom"
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  disabled={isApplying}
                />
                {couponDiscount > 0 ? (
                  <button
                    onClick={onClearCoupon}
                    className="cursor-pointer bg-transparent text-red-600 font-medium text-base py-2 px-4 rounded-xl hover:bg-red-50 transition-all duration-200"
                  >
                    Remover
                  </button>
                ) : (
                  <button
                    onClick={onApplyCoupon}
                    className="cursor-pointer bg-transparent text-background-dark font-bold text-lg py-2 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    disabled={isApplying}
                  >
                    {isApplying ? "Aplicando..." : "Aplicar"}
                  </button>
                )}
              </div>
              {couponDiscount > 0 && (
                <p className="text-sm text-green-700 mt-2">
                  Cupom {couponCode} aplicado. Desconto de R$
                  {couponDiscount.toFixed(2).replace(".", ",")}.
                </p>
              )}
            </div>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              couponDiscount={couponDiscount}
              couponCode={couponCode}
              shipping="Grátis"
              total={totalComCupom}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
