"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import ImageGallery from "@/components/product/ImageGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductDescription from "@/components/product/ProductDescription";
import RelatedProducts from "@/components/product/RelatedProducts";
import FeatureSection from "@/components/product/FeatureSection";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useVideosByCategory } from "@/hooks/useVideosByCategory";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { Video } from "@/types/product";
import { getImageURL } from "@/lib/utils";

const ProductPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  
  const { product, isLoading, error } = useProductDetails(slug);
  const { videos } = useVideosByCategory(product?.categoriaId || 0);
  const { products: relatedProducts } = useRelatedProducts(
    product?.categoriaId || 0,
    product?.id || 0,
    10
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedColorIndex(0);
      document.title = `${product.nome} - Chase a Flare`;
    }
  }, [product]);

  if (!mounted) {
    return (
      <div className="bg-white font-display text-primary pt-24">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white font-display text-primary pt-24">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white font-display text-primary pt-24">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Produto não encontrado</div>
          </div>
        </main>
      </div>
    );
  }

  // Preparar imagens para a galeria (apenas da cor selecionada)
  const selectedColor = product.coresDisponiveis[selectedColorIndex];
  const images = selectedColor
    ? selectedColor.imagens.slice(0, 5).map((img) => ({
        src: getImageURL(img.url),
        alt: `${selectedColor.nome} - ${img.id}`,
      }))
    : [];

  // Calcular parcelas
  const valorParcela = product.preco / product.maxParcelas;
  const installments = `${product.maxParcelas}x de R$ ${valorParcela
    .toFixed(2)
    .replace(".", ",")}`;

  return (
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Coluna 1: Galeria de Imagens + Descrição */}
          <div className="space-y-8">
            <ImageGallery images={images} />

            {/* Descrição - Desktop: ao lado das imagens, Mobile: antes dos vídeos */}
            {product.descricao && (
              <div className="lg:block hidden">
                <ProductDescription description={product.descricao} />
              </div>
            )}
          </div>

          {/* Coluna 2: Detalhes do Produto */}
          <ProductDetails
            name={product.nome}
            price={`R$ ${product.preco.toFixed(2).replace(".", ",")}`}
            installments={installments}
            sku={product.sku}
            color={selectedColor?.nome || "N/A"}
            maxParcelas={product.maxParcelas}
            taxaJuros={product.taxaJuros}
            selectedColorIndex={selectedColorIndex}
            onColorChange={setSelectedColorIndex}
            produtoId={product.id}
            {...({
              coresDisponiveis: product.coresDisponiveis,
              videos: videos || [],
            } as any)}
          />
        </div>

        {/* Descrição - Mobile: antes dos vídeos */}
        {product.descricao && (
          <div className="lg:hidden block mt-8">
            <ProductDescription description={product.descricao} />
          </div>
        )}

        {/* Seção de Produtos Relacionados */}
        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
    </div>
  );
};

export default ProductPage;
