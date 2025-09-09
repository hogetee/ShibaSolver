'use client';
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Welcome To Shiba Solver</h1>
        <div className="flex flex-col gap-4">
          <Button 
            variant="contained" 
            onClick={() => router.push('/u/me')}
          >
            Go to My Profile
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/u/testuser')}
          >
            View Test User Profile
          </Button>
        </div>
      </main>
    </div>
  );
}
