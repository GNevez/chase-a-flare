"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useAllCategories } from "@/hooks/useAllCategories";
import { getImageURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const CollectionsPage = () => {
  const { categories, isLoading, error } = useAllCategories();

  if (isLoading) {
    return (
      <div
        className={
          "min-h-screen bg-white flex items-center justify-center " +
          montserrat.className
        }
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-primary text-lg">Carregando coleções...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={
          "min-h-screen bg-white flex items-center justify-center px-4 " +
          montserrat.className
        }
      >
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Erro ao carregar coleções</p>
          <p className="text-primary/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "min-h-screen bg-gradient-to-b from-white to-neutral-50 mx-auto px-4 md:px-8 lg:px-[10%] py-32 md:py-40 " +
        montserrat.className
      }
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl text-primary font-bold mb-4">
            Nossas Coleções
          </h1>
          <p className="text-primary/70 text-lg md:text-xl max-w-2xl mx-auto">
            Descubra estilos únicos e atemporais para cada momento
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-primary/60 text-lg">
              Nenhuma coleção disponível no momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                href={`/collections/${category.slug}`}
                key={category.id}
                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Imagem de fundo */}
                <div className="relative w-full h-80 md:h-96 overflow-hidden bg-neutral-200">
                  {category.banner ? (
                    <Image
                      src={getImageURL(category.banner)}
                      alt={category.nome}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
                      <span className="text-4xl font-bold text-primary/30">
                        {category.nome.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Conteúdo de texto */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500">
                  {/* Título sempre visível */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {category.titulo || category.nome}
                  </h3>

                  {/* Mensagem que sobe ao hover */}
                  {category.mensagem && (
                    <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/90 text-sm md:text-base line-clamp-3 drop-shadow-md">
                        {category.mensagem}
                      </p>
                    </div>
                  )}

                  {/* Indicador visual de hover */}
                  <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-accent transition-colors duration-300">
                    <span className="text-sm font-medium">Ver coleção</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
