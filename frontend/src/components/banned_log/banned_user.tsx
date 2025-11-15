import React, { useState } from 'react';

// No 'styled-components' or './BannedUser.css' import is needed

interface BannedUserProps {
  name: string;
  nickname: string;
  bannedDate: string;
  profileImage: string;
  userId: number;
}

const BannedUser: React.FC<BannedUserProps> = ({
  name,
  nickname,
  bannedDate,
  profileImage,
  userId,
}) => {

  const [isUnbanning, setIsUnbanning] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';

  const handleUnban = async () => {
    setIsUnbanning(true);
    try {
      const res = await fetch(`${BASE}/api/v1/admins/users/${userId}/unban`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body?.message || `Unban request failed: ${res.status}`;
        console.error(msg);
        alert(msg);
        return;
      }
      console.log('Unban success', body);
      alert('User has been unbanned');
      window.location.reload();
    } 

    catch (err: any) {
      console.error('Unban error', err);
      alert('Unban failed: ' + (err?.message || err));
    } 

    finally {
      setIsUnbanning(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-10 flex flex-col shadow-xl my-4 gap-4 font-display">
      <div className="flex flex-row items-center justify-between ">
        <div className="flex flex-row gap-4">
            <img
            src={profileImage}
            alt={`${nickname}'s avatar`}
            className="w-25 h-25 rounded-full"
            onError={(e) => {
                e.currentTarget.src = "/image/DefaultAvatar.png";
            }}
            />
            <div className="flex flex-col">
                <h3 className="text-[#865DFF]  text-xl font-semibold ">{name}</h3>
                <span className="text-[#865DFF] text-4xl font-bold">{nickname}</span>
            </div>
        </div>
        <button
          className="bg-[#FF3B30] text-white border-none py-1 px-2 rounded-lg text-xl cursor-pointer font-medium hover:bg-[#FF1F1F] disabled:opacity-50"
          onClick={handleUnban}
          disabled={isUnbanning}
        >
          {isUnbanning ? 'Unbanning...' : 'Unban'}
        </button>
        </div>



        {/* <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-3 px-5"> */}
          {/* Left: Reason of Ban (label stays fixed, value wraps) */}
          {/* <div className="flex items-start gap-3 max-w-full">
            <span className="bg-[#4B0082] text-white py-2 px-3 rounded-lg text-xl font-bold shrink-0">
              Reason of Ban
            </span>
            <span className="font-bold text-xl  whitespace-normal flex-1 min-w-0 max-w-full mt-2">
              {reasonOfBan}
            </span>
          </div> */}

          {/* Right: Banned Since (align to right on md+, stays below on small screens) */}
          <div className="flex items-end gap-3 justify-end md:justify-end max-w-full">
            <span className="bg-[#4B0082] text-white py-2 px-3 rounded-lg text-xl font-bold shrink-0">
              Banned Since
            </span>
            <span className="font-bold text-xl break-words whitespace-nowrap ml-2 mt-2">
              {bannedDate}
            </span>
          </div>
        {/* </div> */}

    </div>
     );
};

export default BannedUser;