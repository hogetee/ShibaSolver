import UserProfile from '@/pages/UserProfilePage';
type Props = {
  params: Promise<{
    username: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UserPage({ params, searchParams }: Props) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="min-h-screen">
      <UserProfile searchParams={resolvedSearchParams} />
    </div>
  );
}
