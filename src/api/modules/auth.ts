import { apiClient } from "../axiosClient";
import type {
  User,
  LoginData,
  RegisterData,
  UpdateProfileData,
} from "../../types";

type AuthResponse = {
  user: User;
};

/**
 * register a new user
 * @param data - The user's registration details (firstName, lastName, email, password).
 * @returns The newly created user's data.
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse, RegisterData>("/auth/register", data);
};

/**
 * Logs a user in using the local email/password strategy.
 * @param data - The user's credentials.
 * @returns The authenticated user's data.
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse, LoginData>("/auth/login", data);
};

/**
 * checks user session
 * @returns user object
 */
export const checkSession = async (): Promise<AuthResponse> => {
  return apiClient.get<AuthResponse>("/auth/me");
};

/**
 * Logs the current user out by destroying the session on the server.
 */
export const logout = async (): Promise<void> => {
  return apiClient.post<void>("/auth/logout");
};

/**
 * Updates the currently authenticated user's profile (first name, last name).
 * @param data - The profile data to update.
 * @returns The updated user data.
 */
export const updateProfile = async (
  data: UpdateProfileData
): Promise<AuthResponse> => {
  return apiClient.put<AuthResponse, UpdateProfileData>("/auth/me", data);
};

/**
 * Uploads a new avatar for the currently authenticated user.
 * @param file - The image file to upload (from a file input).
 * @returns The user data with the updated avatar URL.
 */
export const uploadAvatar = async (file: File): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiClient.upload<AuthResponse>("/auth/avatar", formData);
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const getGoogleAuthUrl = (): string => {
  return `${API_BASE_URL}/auth/google`;
};
