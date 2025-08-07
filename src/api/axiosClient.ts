import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse, ApiErrorResponse } from "../types"; // Your custom types

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Crucial for sending cookies
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

          // Check if the password fields exist to avoid errors
          if (data && data.password && data.confirmPassword) {
            // 1. If passwords do not match, stop the request before it's sent
            if (data.password !== data.confirmPassword) {
              console.error(
                "Client-side validation failed: Passwords do not match."
              );
              // Reject the promise with a user-friendly error message
              // This will be caught by the .catch() block in your auth hook
              return Promise.reject({
                status: "fail",
                message: "Passwords do not match. Please try again.",
              });
            }

            // 2. If they match, create a new payload without the 'confirmPassword' field
            console.log(
              "Passwords match. Stripping 'confirmPassword' from request payload."
            );
            const { confirmPassword, ...payload } = data;

            // 3. Update the request config's data with the new payload
            config.data = payload;
          }
        }
        // --- END: MODIFICATION FOR REGISTRATION ---

        console.log(
          `Sending request to: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config; // Allow all other requests to proceed
      },
      (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // --- Response Interceptor ---
    this.client.interceptors.response.use(
      // --- On Success ---
      // This part is your design: it unwraps the successful response.
      <T>(response: AxiosResponse<ApiResponse<T>>) => {
        console.log(`Success response from: ${response.config.url}`);
        // Assuming your successful server response is always { success: true, data: {...} }
        return response.data.data;
      },

      // --- On Error ---
      // This part incorporates the robust logic from the inspiration code.
      (error: AxiosError<ApiErrorResponse>) => {
        // Handle network errors or unexpected issues
        if (!error.response) {
          console.error("Network Error:", error.message);
          // Return a standardized error object
          return Promise.reject({
            status: "error",
            message:
              "Network error. Please check your connection and try again.",
          });
        }

        // Extract useful info from the error response
        const { status, config, data: errorData } = error.response;
        const requestUrl = config.url || "";

        console.error(
          `Error response: ${status} from ${config.method?.toUpperCase()} ${requestUrl}`
        );

        // --- INTELLIGENT 401 (UNAUTHORIZED) HANDLING ---
        if (status === 401) {
          // 1. Don't redirect on failed login/register attempts.
          // Let the form handle the error message.
          if (
            requestUrl.endsWith("/auth/login") ||
            requestUrl.endsWith("/auth/register")
          ) {
            console.log("Authentication failed for login/register.");
            return Promise.reject(errorData); // Reject with server message (e.g., "Invalid credentials")
          }

          // 2. Don't redirect on a failed session check.
          // This is an expected "error" for logged-out users.
          if (requestUrl.endsWith("/auth/me")) {
            console.log("No active session found.");
            return Promise.reject(errorData); // Reject silently
          }

          // 3. For all other 401 errors, redirect to login.
          // This happens when a session cookie expires during navigation.
          console.log("Session expired or invalid. Redirecting to login.");
          window.location.href = "/login";
          // We still reject to stop any further processing in the original call
          return Promise.reject(errorData);
        }

        // For all other errors (400, 404, 500, etc.), reject with the server's error payload.
        // This allows the calling code (e.g., React hooks) to handle it.
        return Promise.reject(errorData);
      }
    );
  }

  /**
   * =============================================================================
   *  API METHODS
   *  THE BUG FIX IS HERE: All methods now correctly return the `response` from the
   *  interceptor, which is the already-unwrapped data.
   * =============================================================================
   */

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response as T; // The interceptor has already returned the unwrapped data
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
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

// Export a singleton instance of the client
export const apiClient = new ApiClient();
