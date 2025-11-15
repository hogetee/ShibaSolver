'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MeProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (username && username.trim().length > 0) {
      router.replace(`/user/${username}`);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading && <p>Redirecting...</p>}
    </div>
  );
}
