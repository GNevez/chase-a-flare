// components/ProductDetails.tsx
import FeatureSection from "./FeatureSection";

interface ProductDetailsProps {
  name: string;
  price: string;
  installments: string;
  sku: string;
  color: string;
}

const FeatureIcon: React.FC<{ iconPath: string; label: string }> = ({
  iconPath,
  label,
}) => (
  <div className="flex flex-col items-center">
    <svg
      className="h-8 w-8 text-accent mb-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={iconPath} strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
    <p className="text-xs text-primary/70 dark:text-background-light/70 font-light">
      {label}
    </p>
  </div>
);

const ProductDetails: React.FC<ProductDetailsProps> = ({
  name,
  price,
  installments,
  sku,
  color,
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Título e Preço */}
      <div>
        <h1 className="text-4xl font-bold text-primary dark:text-background-light">
          {name}
        </h1>
        <div className="flex items-baseline space-x-2 mt-4">
          <p className="text-5xl font-extrabold text-primary dark:text-background-light">
            {price}
          </p>
          <span className="text-lg text-primary/70 dark:text-background-light/70 font-light">
            ou {installments}
          </span>
        </div>
      </div>

      {/* Selo de Proteção */}
      <div className="flex items-center space-x-3 text-sm text-primary dark:text-background-light">
        <svg
          className="h-6 w-6 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <span className="font-light">Proteção Solar UV 400</span>
      </div>

      {/* Opção de Cor */}
      <div>
        <p className="text-sm font-medium text-primary/80 dark:text-background-light/80 mb-2">
          Cor: {color} (SKU: {sku})
        </p>
        {/* A cor seria dinâmica, aqui é um placeholder */}
        <div className="w-8 h-8 rounded-full bg-primary border-2 border-background-light dark:border-primary"></div>
      </div>

      {/* Botão de Compra */}
      <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors duration-300">
        Adicionar ao carrinho
      </button>

      {/* Benefícios (Compra Segura, Troca Fácil, Frete Rápido) */}
      <div className="flex-col flex  text-center pt-4">
        <div className="flex w-full justify-around">
          <FeatureIcon
            label="Compra Segura"
            iconPath="M9 12l2 2 4-4m6-4l-6 6-6-6M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
          <FeatureIcon
            label="Troca Fácil"
            iconPath="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36"
          />
          <FeatureIcon
            label="Frete Rápido"
            iconPath="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h2"
          />
        </div>
        <FeatureSection />
      </div>
    </div>
  );
};

export default ProductDetails;
