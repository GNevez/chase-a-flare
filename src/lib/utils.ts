import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getBaseURL } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageURL = (path: string): string => {
  if (!path) return "";
  return `${getBaseURL()}${path}`;
};

// Re-exporta getBaseURL do api.ts para manter compatibilidade
export { getBaseURL };
