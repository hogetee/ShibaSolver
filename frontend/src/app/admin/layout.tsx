import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      {children}
    </AdminProtectedRoute>
  );
}