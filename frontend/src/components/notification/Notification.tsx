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

  // No timezone-offset correction needed: both Date.now() and date.getTime() are epoch ms
  const diffMs = Date.now() - date.getTime();
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
                {formatTimeAgo(notificationData.created_at)}
            </span>
          </li>
      </ul>
    </aside>
  );
}

export default Notification;
