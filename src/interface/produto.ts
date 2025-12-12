export interface Produto {
  id: number;
  nome: string;
  slug: string;
  preco: number;
  descricao: string;
  sku: string;
  categoriaNome: string;
  imagemPrincipal: string;
  imagemHover?: string;
  precoOriginal?: number;
  isSale?: boolean;
  isNew?: boolean;
  coresDisponiveis: Array<{
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
}

export interface ProdutosCor {
  id: number;
  corId: number;
  corNome: string;
  corHex: string;
  imagens: Array<{
    id: number;
    imagemUrl: string;
  }>;
}

export interface UseProductsParams {
  pageNumber: number;
  pageSize: number;
  categoriaId?: number | null;
  corId?: number | null;
  precoMin?: string;
  precoMax?: string;
  ordenacao?: string | undefined;
}

export interface UseProductsReturn {
  products: Produto[];
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
