"use client";
import React, { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: ImageProps[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]?.src || "");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Miniaturas */}
        <div className="flex md:flex-col gap-2 justify-center">
          {images.map((image, index) => (
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
          ))}
        </div>
        {/* Imagem Principal */}
        <div className="flex-1">
          <div className="aspect-square w-full">
            <img
              alt="Main Product Image"
              className="w-full h-full object-cover rounded-xl"
              src={mainImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
