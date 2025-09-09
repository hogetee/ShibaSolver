'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfilePage from '@/pages/UserProfilePage';

export default function MeProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Attempt to read the authenticated username from client storage
    // If not found, redirect to home (could be a login page in future)
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
    if (username && username.trim().length > 0) {
      router.replace(`/u/${username}`);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    // This is just shown briefly during redirect
    <div className="min-h-screen p-4">
      <UserProfilePage />
    </div>
  );
}
