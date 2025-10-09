"use client";

import { useParams } from "next/navigation";

const collectionsData: any = {
  verao: {
    title: "Coleção de Verão",
    description:
      "Descubra os estilos mais quentes da estação, perfeitos para qualquer ocasião ensolarada.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJkJKs_K5axr6apzYIcaSXvVtnuVI9_zkGhCObBLLyhLAaLs3y8o_fen9J_JG_vwbY7UAMlMfPqviOtCJwk7Gw84MuBGeA4Bp6p2d5TBNEB3t_Jh7IghqYeth5CVB8unvaYexSdPV7ofe9VZBpVzQixHC6idshnsHjiUH8QFdRaqIwHHKdYO3gG3R0ywwp_uTNiUI08kleHw6CLYNzrRuOSOj-sK_XtPZFv4qO-7KMpPo9yWe1gpKt58C2quH2iU9KYzTD4MjY9tA",
  },
  inverno: {
    title: "Coleção de Inverno",
    description:
      "Aconchego e estilo para os dias mais frios. Veja as novidades.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6PTDWUhqOcNQfUqKKtx7ZfxR5NViFq3_GIhEz6dDjbpt7HahrJNVHU4JR6szSmC1baok6u5nCv4OeyOT2tS9RADFBcgRLa2gJ38a_FQ31lzjBYygo8U9zhPWwJPaSM_1ZTxWd2icZRCbXrorcc2Q9SzRb9KDuJl06UPy32baohrallJOIDY01wQzDjy40FkhEKnEg2wqMjn9lURqByGcOGMX5wGO7zjtFq08lJyfWo2LVvR-WfBxETWqqRDOOhat9esxMgTX-Q3g1",
  },
  festa: {
    title: "Coleção Festa",
    description: "Brilhe em qualquer evento com nossos modelos exclusivos.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6PTDWUhqOcNQfUqKKtx7ZfxR5NViFq3_GIhEz6dDjbpt7HahrJNVHU4JR6szSmC1baok6u5nCv4OeyOT2tS9RADFBcgRLa2gJ38a_FQ31lzjBYygo8U9zhPWwJPaSM_1ZTxWd2icZRCbXrorcc2Q9SzRb9KDuJl06UPy32baohrallJOIDY01wQzDjy40FkhEKnEg2wqMjn9lURqByGcOGMX5wGO7zjtFq08lJyfWo2LVvR-WfBxETWqqRDOOhat9esxMgTX-Q3g2",
  },
};

export function CollectionBanner() {
  const params = useParams(); 

  const collectionParam = (params.collection as string) || "verao";

  const currentCollection =
    collectionsData[collectionParam] || collectionsData.verao;

  return (
    <div className="group relative w-full overflow-hidden rounded-xl min-h-[320px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-10">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${currentCollection.imageUrl}")`,
        }}
      />
      <div className="relative z-10 max-w-md text-white">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          {currentCollection.title}
        </h2>
        <p className="mt-2 text-base font-light text-white/80">
          {currentCollection.description}
        </p>
      </div>
    </div>
  );
}
