"use client"

import { useState } from "react";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export function useDeleteAccount(onSuccess) {
  const { deleteUser, isLoading, error } = useDeleteUser();
  const [showError, setShowError] = useState(false);

  const handleDelete = async () => {
    try {
      setShowError(false);
      await deleteUser();

      if (typeof window !== "undefined") {
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:logout"));
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setShowError(true);
      console.error("Failed to delete account:", err);
    }
  };

  return { showError, isLoading, error, handleDelete };
}