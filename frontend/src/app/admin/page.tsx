import React from 'react';
import Link from 'next/link';
import QuickStat from '@/components/admin_dashboard/QuickStat';
import AdminButtons from '@/components/admin_dashboard/AdminButtons';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BlockIcon from '@mui/icons-material/Block';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

export default function AdminDashboard() {
    //incase we want to implement this but not important
  const adminStats = {
    totalReports: 23,
    unreviewedReports: 15,
    bannedAccounts: 8,
    totalUsers: 1250,
  };

  const adminActions = [
    {
      title: 'Report Management',
      description: 'Review and manage user reports for posts and accounts',
      href: '/admin/reports',
      // stats: `${adminStats.unreviewedReports} unreviewed reports`,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      icon: <ReportGmailerrorredIcon className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Banned Accounts',
      description: 'Manage banned user accounts and review ban appeals',
      href: '/admin/banned-accounts',
      // stats: `${adminStats.bannedAccounts} banned accounts`,
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-600',
      icon: <BlockIcon className="w-6 h-6 text-red-600" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-20 font-display">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and monitor your Shiba platform</p>
          </div>
          <AdminLogoutButton />
        </div>

        {/* Admin Action Buttons */}
        <AdminButtons adminActions={adminActions} />

        </div>
    </div>
  );
}