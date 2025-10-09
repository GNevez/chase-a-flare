import { ProductCard } from "./productCard";
import { Product } from "@/interface/collection/products";

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
