// components/FeatureSection.tsx
import React from 'react';
import { FeatureSectionProps } from "@/types/product";

const FeatureSection: React.FC<FeatureSectionProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="mt-8 lg:mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-background-light">
        Chase A Flare
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
        {videos?.slice(0, 3).map((video) => (
          <div key={video.id} className="relative group aspect-[9/16]">
            <video
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              muted
              loop
              playsInline
              poster={
                video.thumbnail
                  ? `http://localhost:5006${video.thumbnail}`
                  : undefined
              }
            >
              <source
                src={`http://localhost:5006${video.url}`}
                type="video/mp4"
              />
              Seu navegador não suporta vídeos.
            </video>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 rounded-xl flex items-center justify-center">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {video.titulo}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {video.descricao}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;