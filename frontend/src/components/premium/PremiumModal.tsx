"use client";

import React from "react";

interface Props {
  onClose: () => void;
}

export default function PremiumModal({ onClose }: Props) {
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
    const handleConfirm = async () => {
        try {
            const res = await fetch(`${BASE}/api/v1/users/premium`, {
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
            <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
            <div>
                <p className="text-md text-gray-600 mb-4">
                    Enjoy the full experience on our site, including exclusive sections for premium members.
                </p>
                <p className="text-lg text-accent-600 mb-1">Limited promotion — act now!</p>
                <p>
                    From the regular price of <span className="line-through text-gray-500"> 35 THB/month, </span>
                </p>
                <p>
                    For a limited time, activate Premium with a <span className="font-semibold text-lg text-amber-500">one-time purchase</span> — now <span className="mx-1 font-bold text-2xl text-amber-500">FREE !</span> — and get full access to all premium features.
                </p>
            </div>
            <div className="flex gap-3 justify-end mt-6">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
                Cancel
            </button>
            <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-md cursor-pointer bg-accent-400 text-white hover:bg-accent-600"
            >
                Claim Free Premium
            </button>
            </div>
        </div>
        </div>
    );
}
