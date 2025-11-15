"use client";
import ShibaIcon from "@/components/auth/ShibaIcon";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import GuestContinueButton from "@/components/auth/GuestContinueButton";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { handleGoogleResponse, handleGuestContinue } = useGoogleAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        window.location.href = `/user/${username}`;
        return;
      }
    };
    checkAuth();
  }, [router]);


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-display">
      <div className="bg-purple-100 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-dark-900 mb-2">Sign in to</h1>
          <h1 className="text-5xl font-bold text-dark-900">Shiba Solver</h1>
        </div>

        {/* Shiba Inu Icon */}
        <div className="mb-8 flex justify-center">
          <ShibaIcon />
        </div>

        {/* Google Sign In Button */}
        <div className="mb-4">
          <GoogleSignInButton onSuccess={handleGoogleResponse} />
        </div>

        {/* Continue as Guest Link */}
        <GuestContinueButton onClick={handleGuestContinue} />
      </div>
    </div>
  );
}
