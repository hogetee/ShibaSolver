import React from 'react';

// No 'styled-components' or './BannedUser.css' import is needed

interface BannedUserProps {
  name: string;
  nickname: string;
  reasonOfBan: string;
  bannedDate: string;
  profileImage: string;
}

const BannedUser: React.FC<BannedUserProps> = ({
  name,
  nickname,
  reasonOfBan,
  bannedDate,
  profileImage
}) => {
  const handleUnban = () => {
    // Add unban logic here
    console.log(`Unbanning user: ${name}`);
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
            className="bg-[#FF3B30] text-white border-none py-1 px-2 rounded-lg text-xl cursor-pointer font-medium hover:bg-[#FF1F1F]" 
            onClick={handleUnban}>Unban</button>
        </div>



        <div className="flex flex-row items-center gap-10 px-2">
            <div className="flex items-center gap-3 ">
                <span className="bg-[#4B0082] text-white border-none py-2 px-3 rounded-lg text-lg  font-medium">Reason of Ban</span> 
                <span className="">{reasonOfBan}</span> 
                
            </div>

            <div className="flex items-center gap-3">
                <span className="bg-[#4B0082] text-white border-none py-2 px-3 rounded-lg text-lg  font-medium">Banned Since</span> 
                <span className="">{bannedDate}</span> 
            </div>
        </div>

    </div>
     );
};

export default BannedUser;