// Base API configuration
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import type { ApiError } from "@/types/api";

// Strategy: Tạo axios instance với interceptors
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: attach token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor: handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401: token expired
        if (error.response?.status === 401 && originalRequest) {
          // Try refresh token logic here
          // For now, just clear tokens and redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }

        return Promise.reject(this.transformError(error));
      },
    );
  }

  private transformError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }

    return {
      message: error.message || "Đã xảy ra lỗi không xác định",
      statusCode: error.response?.status || 500,
    };
  }

  // Public methods
  get<T>(url: string, params?: object): Promise<T> {
    return this.client.get(url, { params }).then((res) => res.data);
  }

  post<T>(url: string, data?: object): Promise<T> {
    return this.client.post(url, data).then((res) => res.data);
  }

  put<T>(url: string, data?: object): Promise<T> {
    return this.client.put(url, data).then((res) => res.data);
  }

  delete<T>(url: string): Promise<T> {
    return this.client.delete(url).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();
