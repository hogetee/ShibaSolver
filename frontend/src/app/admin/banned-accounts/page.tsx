'use client';
import BannedUser from '@/components/banned_log/banned_user';

// Mock data for banned users
const mockBannedUsers = [
  {
    id: 1,
    name: "Pornmongkol Taniggarn",
    nickname: "Nano",
    reasonOfBan: "Offensive Account",
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
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pt-20 font-display">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Banned Accounts</h1>
                <p className="text-gray-600 mb-6">Manage banned user accounts and review ban appeals</p>
                
                <div className="space-y-4">
                    {mockBannedUsers.map((user) => (
                        <BannedUser
                            key={user.id}
                            name={user.name}
                            nickname={user.nickname}
                            reasonOfBan={user.reasonOfBan}
                            bannedDate={user.bannedDate}
                            profileImage={user.profileImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}