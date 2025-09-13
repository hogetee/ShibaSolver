import React from "react";

export interface NotificationData {
  noti_id: string;
  message: string;
  time: string;
}

interface NotificationProps {
  notificationData: NotificationData;
}


const Notification = ({ notificationData }: NotificationProps) => {
  return (
    <ul className="space-y-2 text-md mb-2">
        <li key={notificationData.noti_id} className="bg-purple-100 rounded p-2 flex justify-between items-center font-display">
          <span>
              {notificationData.message}
          </span>
          <span className="text-sm text-gray-500 font-display">
              {notificationData.time}
          </span>
        </li>
    </ul>
  );
}

export default Notification;
