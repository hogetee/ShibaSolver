import UserProfile from '@/pages/UserProfilePage';
type Props = {
  params: {
    username: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function UserPage({ params, searchParams }: Props) {
  const { username } = params;
  
  return (
    <div className="min-h-screen">
      <UserProfile searchParams={searchParams} />
    </div>
  );
}
