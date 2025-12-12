export interface CorDisponivel {
  id: number;
  nome: string;
  hex1: string;
  hex2?: string;
}

export interface UseCoresDisponiveisReturn {
  cores: CorDisponivel[];
  isLoading: boolean;
  error: string | null;
}
