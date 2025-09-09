import UserProfile from '@/pages/UserProfilePage';
type Props = {
  params: {
    username: string
  }
}

export default function UserPage({ params }: Props) {
  const { username } = params;
  
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold">Profile: {username}</h1>
      {/* Add your profile content here */}
      {/* You can fetch user data based on the username parameter */}
      <UserProfile />
    </div>
  );
}
