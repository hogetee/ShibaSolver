import React from "react";

function parseTimestampToDate(ts?: string | null): Date | null {
  if (!ts) return null;
  const raw = String(ts).trim();

  // Convert to ISO-like string and trim fractional seconds to milliseconds
  let s = raw.replace(" ", "T");
  s = s.replace(/\.(\d{3})\d+/, ".$1"); // truncate extra fractional digits

  // If string does not include timezone info (Z or ±HH[:MM]), treat it as UTC by appending 'Z'
  // This is safe because your DB timestamps are UTC+0.
  if (!/[Zz]|[+-]\d{2}(:?\d{2})?$/.test(raw)) {
    s = s + "Z";
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;

  // Fallback: try Date constructor with original string
  const d2 = new Date(raw);
  return isNaN(d2.getTime()) ? null : d2;
}

function formatRelativeTime(ts?: string | null): string {
  if (!ts) return "";

  const date = parseTimestampToDate(ts);
  if (!date) return String(ts);

  const diffMs = Date.now() - date.getTime() + (new Date().getTimezoneOffset() * 60000);
  const sec = Math.floor(diffMs / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec} sec${sec === 1 ? "" : "s"} ago`;
  const mins = Math.floor(sec / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return `yesterday`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const yrs = Math.floor(days / 365);
  return `${yrs} year${yrs === 1 ? "" : "s"} ago`;
}

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
  return (
    <aside className= "p-1 flex flex-col">
      <ul className="space-y-2 text-sm">
          <li 
            key={notificationData.noti_id} 
            className="bg-purple-100 rounded p-2 flex justify-between items-center cursor-pointer hover:bg-purple-200"
            onClick={() => window.location.href = notificationData.href}
          >
            <span className = "w-[80%]">
                {notificationData.message}
            </span>
            <span className= "text-xs text-gray-500 w-[15%]">
                {formatRelativeTime(notificationData.created_at)}
            </span>
          </li>
      </ul>
    </aside>
  );
}

export default Notification;
