"use client";
import React, { useState, useEffect } from "react";

interface ImageProps {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: ImageProps[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]?.src || "");

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0].src);
    }
  }, [images]);

  // Se não houver imagens, não renderizar nada
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center aspect-square w-full bg-neutral-100 rounded-xl">
        <p className="text-primary/60">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Miniaturas */}
        <div className="flex md:flex-col gap-2 justify-center">
          {images.map((image, index) =>
            image.src ? (
              <img
                key={index}
                alt={image.alt}
                className={`w-20 h-20 object-cover rounded-lg border border-primary/10 dark:border-background-light/10 cursor-pointer transition-opacity ${
                  mainImage === image.src
                    ? "opacity-100 border-accent"
                    : "opacity-50 hover:opacity-100"
                }`}
                src={image.src}
                onClick={() => setMainImage(image.src)}
              />
            ) : null
          )}
        </div>
        {/* Imagem Principal */}
        <div className="flex-1">
          <div className="aspect-square w-full">
            {mainImage ? (
              <img
                alt="Main Product Image"
                className="w-full h-full object-cover rounded-xl"
                src={mainImage}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100 rounded-xl">
                <p className="text-primary/60">Sem imagem</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
