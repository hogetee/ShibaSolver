import React from "react";

export interface Notification {
  noti_id: string;
  message: string;
  time: string;
}

interface NotificationsProps {
  notifications: Notification[];
}


function Notifications({ notifications }: NotificationsProps) {
  return (
    <aside className="w-[20%] bg-white border-r p-2 flex flex-col">
      <h2 className="text-lg font-bold mb-6">
        Notifications
      </h2>
      <ul className="space-y-2 text-sm">
        {notifications.map((notiData) => (
          <li key={notiData.noti_id} className="bg-purple-100 rounded p-2 flex justify-between items-center">
            <span>
                {notiData.message}
            </span>
            <span className="text-xs text-gray-500">
                {notiData.time}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Notifications;
