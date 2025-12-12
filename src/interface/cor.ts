export interface Cor {
  id: number;
  nome: string;
  hex: string;
}

export interface UseCoresReturn {
  cores: Cor[];
  isLoading: boolean;
  error: string | null;
}
