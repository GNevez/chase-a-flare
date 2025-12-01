"use client";

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
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useDiscounts } from "@/hooks/useDiscounts";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { getImageURL } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export function Cart() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    addItem,
    updateItemQuantity,
    removeItem,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const {
    descontos,
    loading: loadingDescontos,
    calcularTotal,
  } = useDiscounts();

  const { produtos: recommendedProducts, loading: loadingRecommended } =
    useRecommendedProducts(5);

  const itemCount = cart?.totalItens || 0;
  const subtotal = cart?.subtotal || 0;

  const {
    total: finalTotal,
    desconto: valorDesconto,
    descontoInfo,
  } = calcularTotal(subtotal, itemCount);
  const hasDiscount = valorDesconto > 0;

  // Encontrar as faixas de desconto ativas para o indicador visual
  const faixa2 = descontos.find(
    (d) => d.quantidadeMinima === 2 && d.quantidadeMaxima === 2
  );
  const faixa3 = descontos.find(
    (d) => d.quantidadeMinima === 3 && d.quantidadeMaxima === 3
  );
  const faixa4 = descontos.find((d) => d.quantidadeMinima === 4);

  const handleQuantityChange = async (itemId: number, amount: number) => {
    const currentItem = cart?.itens.find((item) => item.id === itemId);
    if (currentItem) {
      const newQuantity = currentItem.quantidade + amount;
      if (newQuantity > 0) {
        await updateItemQuantity(itemId, newQuantity);
      } else {
        await removeItem(itemId);
      }
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
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

      <SheetContent
        className={
          plusJakartaSans.variable +
          // on mobile (smaller than `sm`) make the sheet cover the full viewport
          // keep desktop behavior (max width) on sm and up
          "w-full h-full sm:h-auto sm:max-w-2xl bg-white dark:bg-primary shadow-2xl flex flex-col font-display p-0 rounded-none sm:rounded-xl"
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
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-primary/60 dark:text-white/60">
                Carregando carrinho...
              </p>
            </div>
          ) : itemCount === 0 ? (
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
              {!loadingDescontos && descontos.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-center text-xs text-primary dark:text-white">
                    {/* Primeira etapa: 2 itens */}
                    {faixa2 && (
                      <div className="flex-1 flex flex-col items-center relative">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors ${
                            itemCount >= 2
                              ? "bg-accent text-primary"
                              : "bg-gray-200 dark:bg-white/20 text-gray-500"
                          }`}
                        >
                          {itemCount >= 2 ? "✓" : "1"}
                        </div>
                        <p
                          className={`mt-2 ${
                            itemCount >= 2 ? "" : "opacity-60"
                          }`}
                        >
                          2 itens = R${faixa2.valorPromocional.toFixed(2)}
                        </p>
                        {faixa3 && (
                          <div
                            className={`absolute top-3 left-[50%] w-full h-0.5 -z-10 transition-colors ${
                              itemCount >= 3
                                ? "bg-accent"
                                : "bg-gray-200 dark:bg-white/20"
                            }`}
                          ></div>
                        )}
                      </div>
                    )}

                    {/* Segunda etapa: 3 itens */}
                    {faixa3 && (
                      <div className="flex-1 flex flex-col items-center relative">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors ${
                            itemCount >= 3
                              ? "bg-accent text-primary"
                              : "bg-gray-200 dark:bg-white/20 text-gray-500"
                          }`}
                        >
                          {itemCount >= 3 ? "✓" : "2"}
                        </div>
                        <p
                          className={`mt-2 ${
                            itemCount >= 3 ? "" : "opacity-60"
                          }`}
                        >
                          3 itens = R${faixa3.valorPromocional.toFixed(2)}
                        </p>
                        {faixa4 && (
                          <div
                            className={`absolute top-3 left-[50%] w-full h-0.5 -z-10 transition-colors ${
                              itemCount >= 4
                                ? "bg-accent"
                                : "bg-gray-200 dark:bg-white/20"
                            }`}
                          ></div>
                        )}
                      </div>
                    )}

                    {/* Terceira etapa: 4+ itens */}
                    {faixa4 && (
                      <div className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors ${
                            itemCount >= 4
                              ? "bg-accent text-primary"
                              : "bg-gray-200 dark:bg-white/20 text-gray-500"
                          }`}
                        >
                          {itemCount >= 4 ? "✓" : "3"}
                        </div>
                        <p
                          className={`mt-2 ${
                            itemCount >= 4 ? "" : "opacity-60"
                          }`}
                        >
                          4+ itens = R${faixa4.valorPromocional.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {cart?.itens.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div
                      className="w-24 h-24 rounded-xl bg-center bg-no-repeat bg-contain sm:bg-cover"
                      style={{
                        backgroundImage: `url('${getImageURL(
                          item.produtoImagem
                        )}')`,
                      }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-normal text-primary dark:text-white text-lg">
                        {item.produtoNome}
                      </h3>
                      <p className="text-sm text-primary/60 dark:text-white/60">
                        Cor: {item.corNome}
                      </p>
                      <p className="font-medium text-primary dark:text-white mt-1">
                        R$ {item.produtoPreco.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 border border-slate-200 dark:border-white/20 rounded-md">
                        <Button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary dark:text-white"
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-primary dark:text-white">
                          {item.quantidade}
                        </span>
                        <Button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary dark:text-white"
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        size="icon"
                        variant="ghost"
                        className="text-primary/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full h-9 w-9"
                        disabled={isLoading}
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
            {loadingRecommended ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {recommendedProducts.map((item, index) => (
                  <div key={item.id} className="flex-shrink-0 w-32 group">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        router.push(`/product/${item.slug}`);
                        setIsCartOpen(false);
                      }}
                    >
                      <div className="relative w-full overflow-hidden rounded-lg bg-background-dark/5 dark:bg-background-light/5">
                        <div
                          className="w-full h-32 bg-cover bg-center rounded-xl transition-all duration-500 ease-in-out group-hover:scale-105"
                          style={{
                            backgroundImage: `url('${getImageURL(
                              item.imagemPrincipal
                            )}')`,
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await addItem(
                              recommendedProducts[index].id,
                              recommendedProducts[index].coresDisponiveis[0].id
                            );
                          }}
                          disabled={isLoading}
                          className="cursor-pointer absolute gap-1 bottom-2 right-2 flex h-8 py-4 px-3 items-center justify-center bg-white/70 dark:bg-white/70 text-primary text-sm font-normal rounded-full opacity-95 hover:opacity-100 transition-all duration-300 scale-95 hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Adicionar ao carrinho"
                        >
                          <Plus className="w-3 h-3" />
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-primary dark:text-white truncate group-hover:text-accent transition-colors">
                          {item.nome}
                        </p>
                        <p className="text-sm font-medium text-primary dark:text-white">
                          R$ {item.preco.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {hasDiscount && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary/60 dark:text-white/60">
                    Subtotal original
                  </span>
                  <span className="text-primary/60 dark:text-white/60 line-through">
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              {hasDiscount && descontoInfo && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Desconto promocional (
                    {descontoInfo.descricao || `${itemCount} itens`})
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    -R$ {valorDesconto.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-lg font-normal text-primary dark:text-white">
                  Total
                </span>
                <span className="text-xl font-medium text-primary dark:text-white">
                  R$ {finalTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <Link href="/carrinho">
              <SheetClose asChild>
                <Button className="w-full cursor-pointer bg-accent text-primary font-medium py-4 h-auto text-base rounded-xl hover:bg-accent/90 transition-colors duration-300 mt-4">
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