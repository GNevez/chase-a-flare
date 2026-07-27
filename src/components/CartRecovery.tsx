"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBaseURL } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export function CartRecovery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refetch } = useCart();
  const hasRecovered = useRef(false);

  useEffect(() => {
    const cartToken = searchParams.get("cart");
    
    // Se não tem token ou já recuperou, não faz nada
    if (!cartToken || hasRecovered.current) return;

    const recuperarCarrinho = async () => {
      hasRecovered.current = true;
      
      try {
        const response = await fetch(`${getBaseURL()}/api/cart/recover/${cartToken}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          toast.success("Seu carrinho foi recuperado!", {
            description: "Os produtos que você deixou estão de volta 🛒",
          });
          
          await refetch();
          
          const url = new URL(window.location.href);
          url.searchParams.delete("cart");
          router.replace(url.pathname + url.search, { scroll: false });
        } else {
          console.warn("Carrinho não pode ser recuperado");
          
          const url = new URL(window.location.href);
          url.searchParams.delete("cart");
          router.replace(url.pathname + url.search, { scroll: false });
        }
      } catch (error) {
        console.error("Erro ao recuperar carrinho:", error);
        
        const url = new URL(window.location.href);
        url.searchParams.delete("cart");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    };

    recuperarCarrinho();
  }, [searchParams, router, refetch]);

  // Componente não renderiza nada visualmente
  return null;
}
