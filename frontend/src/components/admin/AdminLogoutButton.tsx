"use client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminLogoutButton() {
  const { logoutAdmin } = useAdminAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from admin panel?')) {
      logoutAdmin();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      title="Admin Logout"
    >
      <LogoutIcon className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
}