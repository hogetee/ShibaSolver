import Link from "next/link";
import LogOut from "@/components/auth/LogOut";

export default function SettingsPage() {
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
                <LogOut />
            </div>
            
      </div>
    </main>
  );
}
