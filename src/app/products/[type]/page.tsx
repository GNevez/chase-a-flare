// app/products/[productId]/page.js

// O objeto `params` é passado como prop para o componente
export default function ProductDetailsPage({ params }: any) {
  // O nome da propriedade no objeto `params` corresponde ao nome do arquivo/pasta dinâmica
  const { type } = params;

  return (
    <div>
      <h1>Detalhes do Produto: {type}</h1>
      {/* Você pode usar o productId para buscar dados de um banco de dados, por exemplo */}
    </div>
  );
}
