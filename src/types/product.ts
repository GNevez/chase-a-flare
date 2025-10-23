export interface ProductDetailsProps {
  name: string;
  price: string;
  installments: string;
  sku: string;
  color: string;
  maxParcelas?: number;
  taxaJuros?: number;
  coresDisponiveis?: Array<{
    id: number;
    nome: string;
    hex1?: string;
    hex2?: string;
    quantidadeEstoque: number;
    imagens: Array<{
      id: number;
      url: string;
    }>;
  }>;
  videos?: Video[];
  selectedColorIndex?: number;
  onColorChange?: (index: number) => void;
}

export interface Video {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  thumbnail?: string;
  duracao: number;
  ordem: number;
  ativo: boolean;
  categoriaId: number;
  categoriaNome: string;
}

export interface FeatureSectionProps {
  videos: Video[];
}
