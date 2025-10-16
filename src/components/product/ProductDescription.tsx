// components/ProductDescription.tsx
import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div className="mt-16 lg:mt-24">
      <h3 className="text-2xl font-bold text-primary dark:text-background-light mb-4">Descrição do Produto</h3>
      <p className="text-primary/80 dark:text-background-light/80 font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription;