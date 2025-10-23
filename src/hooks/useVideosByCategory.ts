import { useState, useEffect } from "react";
import { Video } from "@/types/product";

export function useVideosByCategory(categoryId: number) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (id: number) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5006/api/video/categoria/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar vídeos da categoria");
      }
      const data = await response.json();
      setVideos(data);
    } catch (err: any) {
      console.error("Erro ao buscar vídeos:", err);
      setError(err.message);
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
