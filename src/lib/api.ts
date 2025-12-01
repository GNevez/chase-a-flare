import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const getBaseURL = (): string => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:5006";
  }

  return process.env.NEXT_PUBLIC_API_URL_PROD || "https://chaseaflare.com.br";
};

console.log("🌐 API Base URL:", getBaseURL());

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }
  return null;
};

const deleteToken = (): void => {
  if (typeof window !== "undefined") {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", error, error.response?.data);
    }

    if (error.response?.status === 401) {
      // Para rotas públicas da loja, não é necessário autenticação
      // Apenas log o erro mas não deleta o token
      console.warn("⚠️ Unauthorized request - public route");
    }

    return Promise.reject(error);
  }
);

export const apiRequest = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.get(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.post(url, data, config),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.put(url, data, config),

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.delete(url, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.patch(url, data, config),
};

// Exporta também a instância para casos específicos
export default apiClient;
