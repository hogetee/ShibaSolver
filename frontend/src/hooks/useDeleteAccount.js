"use client"

import { useState } from "react";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export function useDeleteAccount() {
    const { deleteUser, isLoading, error } = useDeleteUser();
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setShowError(false);
      await deleteUser();

      // Clear any stored user data
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");

      // Call success callback (e.g., redirect to home page)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setShowError(true);
      console.error("Failed to delete account:", err);
    }
  };

  return {showError, isLoading, error, handleDelete}
}