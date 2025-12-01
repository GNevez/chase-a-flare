import { useState, useEffect } from "react";
import { Video } from "@/types/product";
import apiClient from "@/lib/api";

export function useVideosByCategory(categoryId: number) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (id: number) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Video[]>(
        `/api/video/categoria/${id}`
      );
      setVideos(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar vídeos:", err);
      setError(
        err.response?.data?.message || err.message || "Erro ao buscar vídeos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(categoryId);
  }, [categoryId]);

  return {
    videos,
    isLoading,
    error,
    refetch: () => fetchVideos(categoryId),
  };
}
