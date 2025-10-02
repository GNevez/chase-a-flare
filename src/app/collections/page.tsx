"use client";

import Image from "next/image";
import Link from "next/link";

import { Montserrat } from "next/font/google";

interface Collection {
  id: number;
  name: string;
  path: string;
  image: string;
}

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400"] });


const CollectionsPage = () => {
  // Coleções fixas
  const fixedCollections: Collection[] = [
    {
      id: 1,
      name: "Todos",
      path: "/collections/todos",
      image:
        "https://usefuel.fbitsstatic.net/img/b/4f4037e3-686d-4dbd-8d44-0aeb8d566cc0.jpg",
    },
    {
      id: 2,
      name: "Masculino",
      path: "/collections/masculino",
      image:
        "https://img.freepik.com/fotos-gratis/conceito-de-turismo-e-ferias-homem-legal-e-atrevido-flertando-com-voce-usando-oculos-escuros-e-apontando_1258-155572.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      id: 3,
      name: "Feminino",
      path: "/collections/feminino",
      image:
        "https://optoculos.vteximg.com.br/arquivos/ids/229956/Banner-Categoria-Sol-Feminino.jpg?v=637266420104900000",
    },
  ];

  // Mock para coleções futuras
  const dynamicCollections: Collection[] = [
    {
      id: 4,
      name: "Premium",
      path: "/collections/premium",
      image: "https://placehold.co/600x400?text=Premium",
    },
    {
      id: 5,
      name: "Vintage",
      path: "/collections/vintage",
      image: "https://placehold.co/600x400?text=Vintage",
    },
    {
      id: 6,
      name: "Infantil",
      path: "/collections/infantil",
      image: "https://placehold.co/600x400?text=Infantil",
    },
    {
      id: 7,
      name: "Esportivo",
      path: "/collections/esportivo",
      image: "https://placehold.co/600x400?text=Esportivo",
    },
    {
      id: 8,
      name: "Casual",
      path: "/collections/casual",
      image: "https://placehold.co/600x400?text=Casual",
    },
  ];


  const allCollections = [...fixedCollections, ...dynamicCollections];

  return (
    <div
      className={
        "container-fluid bg-white mx-auto px-[10%] py-40 " +
        montserrat.className
      }
    >
      <h1 className="text-4xl md:text-5xl text-primary font-bold text-center mb-12">
        Nossas Coleções
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCollections.map((collection) => (
          <Link
            href={collection.path}
            key={collection.id}
            className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          >
            {/* Imagem */}
            <Image
              src={collection.image}
              alt={collection.name}
              width={600}
              height={400}
              className="object-cover w-full h-60 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Label fixa embaixo */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/30">
              <h3 className="text-lg font-semibold text-white text-center">
                {collection.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
