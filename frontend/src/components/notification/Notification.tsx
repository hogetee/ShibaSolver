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
    <ul className="space-y-2 text-sm mb-2">
        <li key={notificationData.noti_id} className="bg-purple-100 rounded p-2 flex justify-between items-center">
          <span>
              {notificationData.message}
          </span>
          <span className="text-xs text-gray-500">
              {notificationData.time}
          </span>
        </li>
    </ul>
  );
}

export default Notification;
