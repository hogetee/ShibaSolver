import { useRouter } from 'next/router';

export function useGoogleAuth() {
     const router = useRouter();
    
      const handleGoogleResponse = (response) => {
        // response.credential is the Google id_token
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';
        fetch(`${API_BASE}/api/v1/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id_token: response.credential }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data?.success) throw new Error('Login failed');
    
            // Keep some prefill values for register page
            if (typeof window !== 'undefined' && data?.data) {
              sessionStorage.setItem('prefill_display_name', data.data.display_name || '');
              sessionStorage.setItem('prefill_avatar_url', data.data.avatar_url || '');
            }
    
            // If the user already has a username, go to /user/[username]
            const uid = data?.data?.user_id;
            if (!uid) {
              router.push('/register');
              return;
            }
    
            return fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' })
              .then((r) => r.json())
              .then((userInfo) => {
                const username = userInfo?.data?.user_name;
                if (username) {
                  if (typeof window !== 'undefined') localStorage.setItem('username', username);
                  router.push(`/user/${username}`);
                } else {
                  router.push('/register');
                }
              });
          })
          .catch((error) => {
            console.error('Error signing in with Google:', error);
          });
      };
    
      const handleGuestContinue = () => {
        router.push('/'); // Redirect to main page
      };

      return { handleGoogleResponse, handleGuestContinue };
}
