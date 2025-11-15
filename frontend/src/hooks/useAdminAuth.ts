"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminLoginData {
  email: string;
  password: string;
}

interface AdminAuthResponse {
  success: boolean;
  token?: string;
  data?: {
    admin_id: number;
    name: string;
    email: string;
  };
  message?: string;
}

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginAdmin = async (loginData: AdminLoginData): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL  ;
      const response = await fetch(`${API_BASE}/api/v1/adminAuth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data: AdminAuthResponse = await response.json();
      console.log("useAdminAuth.loginAdmin response data:", data);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      // Store admin auth token if provided
      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem("adminToken", data.token);
      }

      // Store admin user data if provided
      if (data?.data && typeof window !== "undefined") {
        localStorage.setItem("adminData", JSON.stringify(data.data));
      }

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      // Call logout endpoint - backend will clear the admin_access_token cookie
      const API_BASE = process.env.NEXT_PUBLIC_API_URL  ;
      await fetch(`${API_BASE}/api/v1/adminAuth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error during admin logout:", err);
      // Continue with local cleanup even if API call fails
    }

    if (typeof window !== "undefined") {
      // Clear localStorage only - let backend handle cookie clearing
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    }
    router.push("/admin-login");
  };

  const isAdminAuthenticated = (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("adminToken");
  };

  const clearError = () => setError("");

  return {
    loginAdmin,
    logoutAdmin,
    isAdminAuthenticated,
    isLoading,
    error,
    clearError,
  };
}
