import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { getImageURL } from "@/lib/utils";

export interface LifestyleItem {
  id: string; // category id as string
  name: string;
  slug: string; // category slug for navigation
  image?: string; // thumbnail fallback if any
  videoUrl?: string; // composed URL
  poster?: string; // composed thumbnail
}

interface VideoDto {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  thumbnail?: string | null;
  duracao: number;
  ordem: number;
  ativo: boolean;
  categoriaId: number;
  categoriaNome: string;
  categoriaSlug: string;
}

export function useLifestyleShowcase(count: number = 5) {
  const [items, setItems] = useState<LifestyleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<VideoDto[]>(
        `/api/video/lifestyle?count=${count}`
      );

      const mapped: LifestyleItem[] = (data || []).map((v) => {
        // If video ID is 0, it's a category without video (banner-only)
        const isBannerOnly = v.id === 0;
        
        return {
          id: String(v.categoriaId),
          name: v.categoriaNome || v.titulo,
          slug: v.categoriaSlug,
          image: v.thumbnail ? getImageURL(v.thumbnail) : undefined,
          videoUrl: isBannerOnly ? undefined : getImageURL(v.url),
          poster: v.thumbnail ? getImageURL(v.thumbnail) : undefined,
        };
      });

      // Backend already ensures one per category; slice as extra safety
      const unique = [
        ...new Map(mapped.map((it) => [it.id, it])).values(),
      ].slice(0, count);

      setItems(unique);
    } catch (err: any) {
      console.error("Erro ao montar LifestyleShowcase:", err);
      setError(err?.message || "Erro ao carregar showcase");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return { items, loading, error, refetch: fetchAll };
}
