// components/RelatedProducts.tsx
import React from 'react';

interface RelatedProduct {
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-16 lg:mt-24">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-background-light">Talvez você goste</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div key={index} className="text-center">
            {/* Em um projeto real, idealmente seria usado o componente <Link> do Next.js aqui */}
            <img 
              alt={product.name} 
              className="w-full object-cover rounded-lg mb-4" 
              src={product.image}
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-primary/80">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;