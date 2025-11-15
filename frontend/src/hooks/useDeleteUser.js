import { useState } from 'react';

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL   ;

  const deleteUser = async () => {
    setIsLoading(true);
    setError(null);

    try {

      const response = await fetch(`${API_BASE}/api/v1/users`, {
        method: 'DELETE',
        credentials: 'include', // use httpOnly session cookie (ss_token)
      });

      let data = null;
      try {
        data = await response.json();
      } catch (_) {
        // ignore JSON parse error; we'll surface a generic message below
      }

      if (!response.ok || (data && data.success === false)) {
        const msg = data?.error?.message || data?.message || 'Failed to delete user';
        throw new Error(msg);

      }

      return data;
    } catch (err) {

      setError(err.message || 'Failed to delete user');

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteUser,
    isLoading,
    error,
  };
};
