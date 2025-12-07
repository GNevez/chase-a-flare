"use client";
import { CreditCard, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { getImageURL } from "@/lib/utils";

interface Product {
  id: number;
  nome: string;
  sku: string;
  slug: string;
  preco: number;
  precoOriginal?: number;
  isSale?: boolean;
  isNew?: boolean;
  imagemPrincipal: string;
  imagemHover?: string;
  categoriaNome: string;
  coresDisponiveis: Array<{
    id: number;
    nome: string;
    hex1?: string;
    hex2?: string;
    quantidadeEstoque: number;
    imagens: Array<{
      id: number;
      url: string;
    }>;
  }>;
}

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColorId, setHoveredColorId] = useState<number | null>(null);
  const { addItem, isLoading } = useCart();
  const { toast } = useToast();

  // Determinar qual imagem mostrar baseado na cor em hover
  const getDisplayImage = () => {
    if (hoveredColorId) {
      const hoveredColor = product.coresDisponiveis.find(
        (cor) => cor.id === hoveredColorId
      );
      if (hoveredColor && hoveredColor.imagens.length > 0) {
        // Se está com hover na imagem E tem segunda imagem, mostrar a segunda
        if (isHovered && hoveredColor.imagens.length > 1) {
          return getImageURL(hoveredColor.imagens[1].url);
        }
        // Caso contrário, mostrar a primeira imagem da cor
        return getImageURL(hoveredColor.imagens[0].url);
      }
    }
    // Fallback: usar imagemHover ou imagemPrincipal
    return isHovered && product.imagemHover
      ? getImageURL(product.imagemHover)
      : getImageURL(product.imagemPrincipal);
  };

  const currentImage = getDisplayImage();

  // Garantir que o preço é um número válido
  const preco = Number(product.preco) || 0;
  const precoOriginal = product.precoOriginal
    ? Number(product.precoOriginal)
    : null;

  // Calcular parcelas (assumindo 12x sem juros)
  const installments = preco / 12;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegação para a página do produto

    if (product.coresDisponiveis && product.coresDisponiveis.length > 0) {
      try {
        // Adicionar com a primeira cor disponível
        const firstColor = product.coresDisponiveis[0];
        await addItem(product.id, firstColor.id, 1);

        // Mostrar toast de sucesso
        toast({
          title: "Produto adicionado!",
          description: `${product.nome} foi adicionado ao carrinho`,
        });

        // Abrir sideCart (será implementado via contexto global)
        // Por enquanto, vamos apenas mostrar o toast
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o produto ao carrinho",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className="group cursor-pointer flex flex-col text-background-dark dark:text-background-light"
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-background-dark/5 dark:bg-background-light/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg transition-all duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url("${currentImage}")` }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

        {/* Badges de Sale e New */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isSale && (
            <span className="bg-primary text-accent flex justify-center text-xs px-2 py-1 rounded-sm font-semibold">
              Promoção
            </span>
          )}
          {product.isNew && (
            <span className="bg-accent text-primary flex justify-center text-xs px-2 py-1 rounded-sm font-semibold">
              Lançamento
            </span>
          )}
        </div>

        {/* Botão de adicionar ao carrinho */}
        <button
          onClick={handleAddToCart}
          disabled={
            isLoading ||
            !product.coresDisponiveis ||
            product.coresDisponiveis.length === 0
          }
          className="cursor-pointer absolute gap-1 bottom-4 right-4 flex h-10 py-6 px-4 items-center justify-center bg-white/70 text-primary text-sm font-normal rounded-full opacity-95 hover:opacity-100 transition-all duration-300 scale-95 hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-4 text-left">
        <p className="font-medium text-primary">{product.nome}</p>
        <p className="text-xs text-primary/60 mb-2">{product.categoriaNome}</p>

        <div className="flex items-center gap-2">
          <p className="text-primary text-base font-bold">
            R$ {preco.toFixed(2).replace(".", ",")}
          </p>
          {precoOriginal && precoOriginal > preco && (
            <p className="text-primary/70 text-sm line-through">
              R$ {precoOriginal.toFixed(2).replace(".", ",")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-primary/70 mt-1">
          <CreditCard className="h-4 w-4" />
          <p className="text-xs font-light">
            até 12x de R$ {installments.toFixed(2).replace(".", ",")} sem juros
          </p>
        </div>

        {product.coresDisponiveis && product.coresDisponiveis.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {product.coresDisponiveis.slice(0, 3).map((cor) => (
                <div
                  key={cor.id}
                  className="w-4 h-4 rounded-full border border-black/10 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                  title={cor.nome}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredColorId(cor.id);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setHoveredColorId(null);
                  }}
                >
                  {cor.hex1 && cor.hex2 ? (
                    // Duas cores - dividir ao meio
                    <div className="w-full h-full flex">
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: `#${cor.hex1}` }}
                      />
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: `#${cor.hex2}` }}
                      />
                    </div>
                  ) : (
                    // Uma cor apenas
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: cor.hex1 ? `#${cor.hex1}` : "#000000",
                      }}
                    />
                  )}
                </div>
              ))}
              {product.coresDisponiveis.length > 3 && (
                <span className="text-xs text-primary/60">
                  +{product.coresDisponiveis.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
