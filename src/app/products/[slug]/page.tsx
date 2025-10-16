// pages/product/[slug].tsx ou app/product/[slug]/page.tsx
import React from "react";
import ImageGallery from "@/components/product/ImageGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductDescription from "@/components/product/ProductDescription";
import RelatedProducts from "@/components/product/RelatedProducts";
import FeatureSection from "@/components/product/FeatureSection";

// Simulação dos dados do produto
const productData = {
  name: "Óculos de Sol Blox",
  price: "R$ 299,00",
  installments: "3x de R$ 99,67",
  sku: "BLX-001",
  color: "Preto",
  description:
    "Os Óculos de Sol Blox são a personificação do estilo moderno e arrojado. Com um design retangular marcante, estes óculos oferecem uma estética ousada e contemporânea. As lentes de alta qualidade garantem 100% de proteção contra raios UVA e UVB, cuidando da sua visão com máxima eficiência. A armação, feita com materiais premium, proporciona durabilidade e um conforto excepcional para uso diário. Leves e resistentes, os Óculos Blox são perfeitos para qualquer ocasião, do casual ao sofisticado.",
  images: [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrnEQus4CPJIDSStCjIBb-RJ8R3FrGGJTNegp97his9na-sTDRr3gzaZmZSWy1_2QIHMPYuaSSbfU0fNgBnCxHR_GKKoKu6rs-N6cUBXmtpyCpBayQ230AurS2VvFHnQwLC5YC5R5eIIOfHIOcqAA9TwylGZ056ox0dxy3JIEMfMNeCx3iKaccMj0iDmV_PSzYEXhEgSg_w8qSSjYnOG9Kbk9Jvk2ViDahtWuJgucOpTHpnhnMXbKyTczSmWdjoPVdAprV9AeWea8",
      alt: "Imagem principal",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNR1YiAUVWUti8d5flb_S9FUj2p-X7VtbzTo7OpmtuBn8D5UYmQ1lRxQbhse931ji2_bYFYvPyaCNHhdBGEBHQPzclsxLL4g1c7bHSoe2j3xgZcSmffSCUozrjJbWHhn21JQwJNieVqLkQrl2m82cNpcqOEKu3IOR3LYxHtkbdKFm4CdzUcI1UGPsRBCU1vrjmc7A5geEBO9zJXxWGKTezys_ckrzT3FJm_WbC-wrsOdlNmCWcYaldaaFkiJjTcz8EKZuyIoN6vJg",
      alt: "Miniatura 2",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgRUaIbcbjtD9ml02itVruBBF1zhNuG96WzytZEjYyzYa9ImAzfmxkPg2ebUdtWiv2Ups0bDv4igY8cKfzk3ruTinINa8xfolC0qVhVTcgfOGJJPl98HTCglrSiPesnme_1I7wgHzxcnafN73l05SqMpjPeThRdHWePxQWMSKU4G8qGU1OkcM3cpZQupaD5OX4aAweDIXYrBxjcX5PuBmQbrr8kh1fHK2nQj6LUlzc6Pe8SgdhUE0U6_J7sykKiW6y63J3iies74Y",
      alt: "Miniatura 3",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4BaA6DMxbrUUZrH1fgJ7HUfo2-M_edED-yexLembRO76_1L5GSYdnsBkb-h94fAcvdkgHi5rU8WoMDwFOR_ToDqJhKxeNaspxUTkuQ2zmU--EVN3JCcYlWEcN3SuR8-WhKCLyNy7dONwkHhC7dQuVFeSOKfQCvRKhyMstYJ8PuHtic9JVFgZjst7sNkPDU_rrcHaQi7yft8k1pufeDooFWOezQnDme4ij-s2eoZ7MESbf3yUUWLAg7_43HUFCsNMwobGv602uFf4",
      alt: "Miniatura 4",
    },
  ],
  relatedProducts: [
    {
      name: "Óculos Vibe",
      price: "R$ 279,00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDgRUaIbcbjtD9ml02itVruBBF1zhNuG96WzytZEjYyzYa9ImAzfmxkPg2ebUdtWiv2Ups0bDv4igY8cKfzk3ruTinINa8xfolC0qVhVTcgfOGJJPl98HTCglrSiPesnme_1I7wgHzxcnafN73l05SqMpjPeThRdHWePxQWMSKU4G8qGU1OkcM3cpZQupaD5OX4aAweDIXYrBxjcX5PuBmQbrr8kh1fHK2nQj6LUlzc6Pe8SgdhUE0U6_J7sykKiW6y63J3iies74Y",
    },
    {
      name: "Óculos Air",
      price: "R$ 319,00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4BaA6DMxbrUUZrH1fgJ7HUfo2-M_edED-yexLembRO76_1L5GSYdnsBkb-h94fAcvdkgHi5rU8WoMDwFOR_ToDqJhKxeNaspxUTkuQ2zmU--EVN3JCcYlWEcN3SuR8-WhKCLyNy7dONwkHhC7dQuVFeSOKfQCvRKhyMstYJ8PuHtic9JVFgZjst7sNkPDU_rrcHaQi7yft8k1pufeDooFWOezQnDme4ij-s2eoZ7MESbf3yUUWLAg7_43HUFCsNMwobGv602uFf4",
    },
    {
      name: "Óculos Flow",
      price: "R$ 259,00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDNR1YiAUVWUti8d5flb_S9FUj2p-X7VtbzTo7OpmtuBn8D5UYmQ1lRxQbhse931ji2_bYFYvPyaCNHhdBGEBHQPzclsxLL4g1c7bHSoe2j3xgZcSmffSCUozrjJbWHhn21JQwJNieVqLkQrl2m82cNpcqOEKu3IOR3LYxHtkbdKFm4CdzUcI1UGPsRBCU1vrjmc7A5geEBO9zJXxWGKTezys_ckrzT3FJm_WbC-wrsOdlNmCWcYaldaaFkiJjTcz8EKZuyIoN6vJg",
    },
    {
      name: "Óculos Wave",
      price: "R$ 299,00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrnEQus4CPJIDSStCjIBb-RJ8R3FrGGJTNegp97his9na-sTDRr3gzaZmZSWy1_2QIHMPYuaSSbfU0fNgBnCxHR_GKKoKu6rs-N6cUBXmtpyCpBayQ230AurS2VvFHnQwLC5YC5R5eIIOfHIOcqAA9TwylGZ056ox0dxy3JIEMfMNeCx3iKaccMj0iDmV_PSzYEXhEgSg_w8qSSjYnOG9Kbk9Jvk2ViDahtWuJgucOpTHpnhnMXbKyTczSmWdjoPVdAprV9AeWea8",
    },
  ],
};

const ProductPage: React.FC = () => {
  // Em um projeto real, você usaria o componente <Head> de 'next/head' ou 'metadata' na app router
  // e o Tailwind estaria configurado no globals.css.

  // As classes 'dark:' dependem de um contexto de tema (theme context) que não está implementado aqui,
  // mas são mantidas para compatibilidade com o seu código original.

  // Utilizando `next/image` seria o ideal para otimização, mas mantive <img> puro para simplificar a conversão inicial.

  return (
    <div className="bg-white font-display text-primary pt-24">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Coluna 1: Galeria de Imagens */}
          <ImageGallery images={productData.images} description={productData.description} />

          {/* Coluna 2: Detalhes do Produto */}
          <ProductDetails
            name={productData.name}
            price={productData.price}
            installments={productData.installments}
            sku={productData.sku}
            color={productData.color}
          />
        </div>

        

        {/* Seção de Descrição */}
       

        {/* Seção de Produtos Relacionados */}
        <RelatedProducts products={productData.relatedProducts} />
      </main>
    </div>
  );
};

export default ProductPage;
