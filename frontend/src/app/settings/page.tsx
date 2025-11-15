"use client";

import Link from "next/link";
import LogOut from "@/components/auth/LogOut";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import PremiumModal from "@/components/premium/PremiumModal";
import CancelPremiumModal from "@/components/premium/CancelPremiumModal";

export default function SettingsPage() {
  const { user: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const is_premium = currentUser?.is_premium;
  const [isGetPremiumOpen, setGetPremiumOpen] = useState(false);
  const [isCancelPremiumOpen, setCancelPremiumOpen] = useState(false);
  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gray-100 font-display">
      <div className="w-full max-w-4xl min-h-screen flex flex-col gap-6 md:gap-8 items-stretch justify-center">
        <h1 className="text-5xl font-bold p-4 mb-2 text-primary-0">Settings</h1>
            <div className="flex flex-col gap-4">
                <Link href="/data-policy" className="cursor-pointer w-full p-4 bg-accent-400 hover:bg-accent-600 text-white rounded-md text-center text-2xl font-medium transition-all duration-300">
                    <p>View Data Policy</p>
                </Link>
                <Link href="/admin" className="cursor-pointer w-full p-4 bg-accent-400 hover:bg-accent-600 text-white rounded-md text-center text-2xl font-medium transition-all duration-300">
                    <p>Admin Menu</p>
                </Link>
                {currentUserLoading ? (
                  <div className="w-full">
                    <button className="w-full p-4 bg-gray-200 text-gray-500 rounded-md text-2xl font-medium cursor-wait" disabled>
                      Getting user information...
                    </button>
                  </div>
                ) : is_premium ? (
                  <button
                    onClick={() => setCancelPremiumOpen(true)}
                    className="cursor-pointer w-full p-4 bg-accent-400/80 hover:bg-accent-600/80 text-white rounded-md text-center text-2xl font-medium transition-all duration-300"
                  >
                    <p>Cancel Premium membership</p>
                  </button>
                ) : (
                  <button
                    onClick={() => setGetPremiumOpen(true)}
                    className="cursor-pointer w-full p-4 bg-amber-400/70 hover:bg-amber-400 text-amber-800 rounded-md text-center text-2xl font-medium transition-all duration-300"
                  >
                    <p>Upgrade to Premium</p>
                  </button>
                )}
                <LogOut />
            </div>
            
      </div>
      {isGetPremiumOpen && (
        <PremiumModal onClose={() => setGetPremiumOpen(false)} />
      )}
      {isCancelPremiumOpen && (
        <CancelPremiumModal onClose={() => setCancelPremiumOpen(false)}/>
      )}
    </main>
  );
}
