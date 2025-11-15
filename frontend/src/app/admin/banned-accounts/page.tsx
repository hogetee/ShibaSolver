'use client';
import BannedUser from '@/components/banned_log/banned_user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

interface BannedUserData {
  userId: number | string;
  name: string;
  nickname: string;
  bannedDate: string;
  profileImage: string;
}

// Mock data for banned users
const mockBannedUsers = [
  {
    id: 1,
    name: "Pornmongkol Taniggarn",
    nickname: "Nano",
    reasonOfBan: "Offensive Accountsdsdsdsdsdsds",
    bannedDate: "31/10/25",
    profileImage: "/images/default-avatar.png"
  },
  {
    id: 2,
    name: "John Doe",
    nickname: "JD",
    reasonOfBan: "Spam Activities",
    bannedDate: "30/10/25",
    profileImage: "/images/default-avatar.png"
  },
  {
    id: 3,
    name: "Alice Smith",
    nickname: "Ali",
    reasonOfBan: "Violation of Terms",
    bannedDate: "29/10/25",
    profileImage: "/images/default-avatar.png"
  }
];

export default function BannedAccountsPage() {
  const BASE = process.env.NEXT_PUBLIC_API_URL  ;
  const [bannedUsers, setBannedUsers] = useState<BannedUserData[]>([]);
  const [isLoadingBanned, setIsLoadingBanned] = useState(true);
  const [errorBanned, setErrorBanned] = useState<string | null>(null);

  const fetchBannedUsers = async () => {
    setIsLoadingBanned(true);
    try {
      const res = await fetch(`${BASE}/api/v1/admins/users/banned`, {
        method: "GET",
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(`Failed to load banned users: ${res.status}`);
        setErrorBanned(`Failed to load banned users: ${res.status}`);
        setBannedUsers([]);
        return;
      }
      const items =  body.data ?? [];
      
      const mapped: BannedUserData[] = items.map((u: any) => ({
        // user_id,
        // user_name,
        // display_name,
        // email,
        // user_state,
        // updated_at AS banned_at
        name: u.user_name,
        nickname: u.display_name,
        bannedDate: u.banned_at,
        profileImage: u.profile_picture,
        userId: u.user_id,
      }));
      
      setBannedUsers(mapped);
    } catch (error) {
      console.error("Error fetching banned users:", error);
      setErrorBanned(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingBanned(false);
    }
  }

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const router = useRouter();

  return (
      <div className="max-w-3xl mx-auto px-4 py-8 pt-20 font-display">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Banned Accounts</h1>
                <p className="text-gray-600">Manage banned user accounts and review ban appeals</p>
              </div>
              <button
                aria-label="Back to admin"
                onClick={() => router.push('/admin')}
                className="ml-4 cursor-pointer inline-flex items-center justify-center bg-accent-200 p-2 rounded-full text-accent-400 hover:text-accent-600 hover:bg-accent-400/50"
              >
                <KeyboardArrowLeftIcon fontSize="small" />
              </button>
            </div>
            <div className="space-y-4">
              {bannedUsers.map((user) => (
                <BannedUser
                  key={user.userId}
                  name={user.name}
                  nickname={user.nickname}
                  bannedDate={user.bannedDate}
                  profileImage={user.profileImage}
                  userId={Number(user.userId)}
                />
              ))}
            </div>
          </div>
      </div>
  );
}