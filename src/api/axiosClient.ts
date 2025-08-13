import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse, ApiErrorResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // --- Request Interceptor ---
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (
          config.method === "post" &&
          config.url?.endsWith("/auth/register")
        ) {
          const data = config.data;

          if (data && data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
              console.error(
                "Client-side validation failed: Passwords do not match."
              );
              return Promise.reject({
                status: "fail",
                message: "Passwords do not match. Please try again.",
              });
            }

            console.log(
              "Passwords match. Stripping 'confirmPassword' from request payload."
            );
            const { confirmPassword, ...payload } = data;

            config.data = payload;
          }
        }

        console.log(
          `Sending request to: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      <T>(response: AxiosResponse<ApiResponse<T>>) => {
        console.log(`Success response from: ${response.config.url}`);
        return response.data.data;
      },

      (error: AxiosError<ApiErrorResponse>) => {
        if (!error.response) {
          console.error("Network Error:", error.message);
          return Promise.reject({
            status: "error",
            message:
              "Network error. Please check your connection and try again.",
          });
        }

        const { status, config, data: errorData } = error.response;
        const requestUrl = config.url || "";

        console.error(
          `Error response: ${status} from ${config.method?.toUpperCase()} ${requestUrl}`
        );

        if (status === 401) {
          if (
            requestUrl.endsWith("/auth/login") ||
            requestUrl.endsWith("/auth/register")
          ) {
            console.log("Authentication failed for login/register.");
            return Promise.reject(errorData);
          }
          if (requestUrl.endsWith("/auth/me")) {
            console.log("No active session found.");
            return Promise.reject(errorData);
          }

          console.log("Session expired or invalid. Redirecting to login.");
          window.location.href = "/login";
          return Promise.reject(errorData);
        }

        return Promise.reject(errorData);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response as T;
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

    const response = await this.client.post<T>(url, data, {
      ...config,
      headers: { ...headers, ...config?.headers },
    });
    return response as T;
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response as T;
  }

  async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response as T;
  }
}

export const apiClient = new ApiClient();
