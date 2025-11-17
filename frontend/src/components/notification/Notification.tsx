import React from "react";

const normalizeToUTC = (s: string) => {
  let t = String(s).trim();
  // Replace first whitespace between date and time with 'T'
  t = t.replace(/\s+/, "T");
  // Truncate fractional seconds to milliseconds (if present)
  t = t.replace(/\.(\d{3})\d+/, ".$1");
  // Strip any existing timezone designator (Z or +HH[:MM] / -HH[:MM])
  t = t.replace(/[Zz]|[+-]\d{2}:?\d{2}$/, "");
  // Append Z to force UTC parsing
  return t + "Z";
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "";

  const now = new Date();
  const commentDate = new Date(normalizeToUTC(dateString));

  // Validate parsed date
  if (isNaN(commentDate.getTime())) {
    console.error("Invalid date string:", dateString);
    return "";
  }

  // Use raw epoch difference; Date.getTime() is absolute (ms since epoch)
  const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (seconds < 0) {
    // กรณีเวลาในอนาคต (อาจเกิดจาก time sync)
    return "just now";
  }
  if (seconds < 60) {
    return seconds <= 1 ? "1 s ago" : `${seconds} s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 m ago" : `${minutes} m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 h ago" : `${hours} h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "1 d ago" : `${days} d ago`;
  }
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? "1 w ago" : `${weeks} w ago`;
  }
  
  const months = Math.floor(days / 30); // ประมาณค่า
  if (months < 12) {
    return months === 1 ? "1 mo ago" : `${months} mo ago`;
  }

  const years = Math.floor(days / 365); // ประมาณค่า
  return years === 1 ? "1 y ago" : `${years} y ago`;
  };

export interface NotificationData {
  noti_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  href: string;
  type: string;
}

interface NotificationProps {
  notificationData: NotificationData;
}


const Notification = ({ notificationData }: NotificationProps) => {
  const isClickable =
    notificationData.type === "comment" || notificationData.type === "reply";

  const handleClick = () => {
    if (!isClickable) return;
    window.location.href = notificationData.href;
  };

  return (
    <aside className= "p-1 flex flex-col">
      <ul className="space-y-2 text-sm">
        <li
          key={notificationData.noti_id}
          onClick={handleClick}
          className={
            "bg-purple-100 rounded p-2 flex justify-between items-center " +
            (isClickable
              ? "cursor-pointer hover:bg-purple-200"
              : "opacity-90")
          }
        >
          <span className= "w-[80%]">{notificationData.message}</span>
          <span className= "text-xs text-gray-500 w-[15%]">
            {formatTimeAgo(notificationData.created_at)}
          </span>
        </li>
      </ul>
    </aside>
  );
};

export default Notification;
