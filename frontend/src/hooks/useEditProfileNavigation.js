import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useEditProfileNavigation({ payload, setErrors, setIsSubmitting, onProfileUpdate }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';

  const updateProfile = useCallback(async () => {
    if (!payload) return false;

    try {
      const res = await fetch(`${apiBase}/api/v1/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_data: payload }),
      });
      const json = await res.json();

      if (!json.success) {
        const msg = json?.error?.message || json?.message || 'Could not save profile';
        setErrors((prev) => ({ ...prev, submit: msg }));
        setIsSubmitting(false);
        return false;
      }

      const username = json.data?.user_name || payload.user_name;
      if (username) localStorage.setItem('username', username);
      
      if (onProfileUpdate) onProfileUpdate();
      
      router.push(`/user/${username}`);
      return true;
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: 'Network error. Please try again.' }));
      setIsSubmitting(false);
      return false;
    }
  }, [payload, router, apiBase, setErrors, setIsSubmitting, onProfileUpdate]);

  const handleDeleteSuccess = useCallback(() => {
    router.push('/');
  }, [router]);

  return { updateProfile, handleDeleteSuccess };
}