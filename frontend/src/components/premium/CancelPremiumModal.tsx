"use client";

import React from "react";

interface Props {
  onClose: () => void;
}

export default function CancelPremiumModal({ onClose }: Props) {
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
    const handleConfirm = async () => {
        try {
            const res = await fetch(`${BASE}/api/v1/users/canclePremium`, {
                method: "PUT",
                credentials: "include",
            });
            if (!res.ok) {
                if (res.status === 401) {
                    console.warn("User not authenticated");
                }
                throw new Error(`Failed to upgrade to premium: ${res.status}`);
            }
            return await res.json();
            }
            catch (error) {
                console.error("Error upgrading to premium:", error);
                return null;
            }
            finally {
                onClose();
                window.location.reload();
            }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-[40%] max-w-md min-w-[300px] shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Cancel Premium</h2>
        <p className="text-md text-gray-600 mb-4">
          Are you sure you want to cancel your premium membership? You will lose your premium features.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md cursor-pointer bg-accent-200/60 hover:bg-accent-200"
          >
            Keep Premium
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md cursor-pointer bg-red-500 text-white hover:bg-red-600"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
