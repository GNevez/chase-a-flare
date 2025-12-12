export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface UseCategoriasReturn {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
}
