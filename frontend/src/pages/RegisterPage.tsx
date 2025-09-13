'use client';

import { useMemo } from 'react';
import RegisterForm from '@/components/register_page/RegisterForm';

export default function RegisterPage() {
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return {} as any;
    return {
      displayName: sessionStorage.getItem('prefill_display_name') || '',
      profilePic: sessionStorage.getItem('prefill_avatar_url') || null,
    } as any;
  }, []);

  return (
    <div className="min-h-screen p-6 flex justify-center items-start">
      <RegisterForm initial={initial} />
    </div>
  );
}

