"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LifestyleCardProps {
  id: string;
  name: string;
  price?: number;
  image?: string;
  videoUrl?: string;
  slug: string;
  poster?: string;
}

export const LifestyleCard: React.FC<LifestyleCardProps> = ({
  name,
  price,
  image,
  videoUrl,
  poster,
  slug
}) => {
  // Estado para controlar a visibilidade do modal de seleção de cor
  const [isOptionsOpen, setOptionsOpen] = useState(false);

  const formatPrice = (price: number) =>
    `R$ ${price.toFixed(2).replace(".", ",")}`;

  const router = useRouter();

  const handleGotoCollection = () => {
    router.push(`/collections/${slug}`);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
      {/* Aumentado AINDA MAIS a altura do card mudando o aspect ratio para [1/2] */}
      <div className="aspect-[1/2] relative">
        {videoUrl ? (
          <video
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            src={videoUrl}
          />
        ) : (
          <img
            src={image || ""}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0">
          {/* Container para as informações do produto */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              {/* Ícone menor */}
              <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-800">
                  <path
                    fill="currentColor"
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H1V11H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H23V9H21Z"
                  />
                </svg>
              </div>
              <div>
                {/* Texto e preço menores */}
                <h3 className="text-white font-semibold text-xs leading-tight">
                  {name}
                </h3>
                {price != null && (
                  <span className="text-white text-xs">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modal de opções que aparece ao clicar no botão de seta
          {isOptionsOpen && (
            <div className="bg-white p-4 mx-2 mb-1 rounded-lg shadow-lg">
              <label
                htmlFor="color-select"
                className="block text-sm font-medium text-black mb-2"
              >
                Escolha a cor:
              </label>
              <select
                id="color-select"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
              >
                <option>Marrom Tartaruga</option>
                <option>Preto Clássico</option>
                <option>Vermelho Vintage</option>
              </select>
              {price != null && (
                <div className="text-right text-xs text-black mt-2">
                  {formatPrice(price)}
                </div>
              )}
            </div>
          )} */}

          {/* Footer com os botões */}
          <div className="flex bg-primary text-white font-medium">
            <button className="flex-grow text-center py-3 transition-opacity hover:opacity-80 font-light" onClick={handleGotoCollection}>
              Ver Coleção
            </button>
            {/* <button
              onClick={() => setOptionsOpen(!isOptionsOpen)}
              className="px-4 border-l border-white/20 transition-opacity hover:opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
