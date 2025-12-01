"use client";

import { getImageURL } from "@/lib/utils";

interface Category {
  id: number;
  nome: string;
  slug: string;
  banner?: string;
  titulo?: string;
  mensagem?: string;
}

interface CollectionBannerProps {
  category: Category | null;
}

export function CollectionBanner({ category }: CollectionBannerProps) {
  if (!category) {
    return null;
  }

  const bannerUrl = category.banner
    ? getImageURL(category.banner)
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuBJkJKs_K5axr6apzYIcaSXvVtnuVI9_zkGhCObBLLyhLAaLs3y8o_fen9J_JG_vwbY7UAMlMfPqviOtCJwk7Gw84MuBGeA4Bp6p2d5TBNEB3t_Jh7IghqYeth5CVB8unvaYexSdPV7ofe9VZBpVzQixHC6idshnsHjiUH8QFdRaqIwHHKdYO3gG3R0ywwp_uTNiUI08kleHw6CLYNzrRuOSOj-sK_XtPZFv4qO-7KMpPo9yWe1gpKt58C2quH2iU9KYzTD4MjY9tA";

  return (
    <div className="group relative w-full overflow-hidden rounded-xl min-h-[320px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-10">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${bannerUrl}")`,
        }}
      />
      <div className="relative z-10 max-w-md text-white">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          {category.titulo || category.nome}
        </h2>
        {category.mensagem && (
          <p className="mt-2 text-base font-light text-white/80">
            {category.mensagem}
          </p>
        )}
      </div>
    </div>
  );
}
