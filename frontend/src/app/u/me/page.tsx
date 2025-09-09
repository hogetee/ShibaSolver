'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserProfilePage from '@/pages/UserProfilePage';

// This is a temporary solution until authentication is implemented
const DUMMY_CURRENT_USER = 'current-user';

export default function MeProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace this with actual auth check and username fetch
    // For now, redirect to the dummy current user profile
    router.push(`/u/${DUMMY_CURRENT_USER}`);
  }, [router]);

  return (
    // This is just shown briefly during redirect
    <div className="min-h-screen p-4">
      <UserProfilePage />
    </div>
  );
}
