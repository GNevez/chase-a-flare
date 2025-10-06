import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function Cart() {
  const itemCount = 3;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="relative bg-transparent hover:bg-accent hover:text-primary text-white hover-glow cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5 " />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-[400px] flex-col bg-white text-black sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-primary">
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {itemCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <ShoppingCart size={64} className="text-gray-300" />
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-500">
                Adicione alguns óculos para começar!
              </p>
            </div>
            <SheetClose asChild>
              <Button size="lg" className="mt-4 w-full text-white ">
                Continuar Comprando
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <p>Itens do carrinho irão aparecer aqui...</p>
            </div>
            <SheetFooter className="mt-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>R$ 0,00</span>
                </div>
                <Button size="lg" className="w-full bg-black text-white ">
                  Finalizar Compra
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
