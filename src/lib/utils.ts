import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBaseURL = (): string => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:5006";
  }
  return process.env.NEXT_PUBLIC_API_URL_PROD || "https://chaseaflare.com.br";
};

export const getImageURL = (path: string): string => {
  if (!path) return "";
  return `${getBaseURL()}${path}`;
};
