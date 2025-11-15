import { useState } from 'react';

// Interface สำหรับข้อมูลที่จะส่งไป Report
interface ReportPayload {
  target_type: 'post' | 'comment';
  target_id: number;
  reason: string;
}

interface ReportApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useReportComment = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
  
  // ✅ 1. เปลี่ยนชื่อฟังก์ชันเป็น reportComment
  const reportComment = async (commentId: string, reason: string): Promise<ReportApiResponse | undefined> => {
    setIsReporting(true);
    setError(null);

    const targetIdNumber = Number(commentId);
    if (isNaN(targetIdNumber) || targetIdNumber <= 0) {
      const errMsg = "Invalid Comment ID provided for reporting.";
      setError(errMsg);
      setIsReporting(false);
      throw new Error(errMsg);
    }

    const payload: ReportPayload = {
      // ✅ 2. เปลี่ยน target_type เป็น 'comment'
      target_type: 'comment', 
      target_id: targetIdNumber,
      reason: reason,
    };

    try {
      const response = await fetch(`${API_BASE}/api/v1/reports/content`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // ✅ 3. อัปเดตข้อความ Error
          throw new Error(responseData.message || 'You have reported this comment recently.');
        }
        throw new Error(responseData.message || 'Failed to report comment');
      }
      
      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsReporting(false);
    }
  };

  const resetReportStatus = () => {
    setError(null);
  };

  // ✅ 4. return ฟังก์ชันที่เปลี่ยนชื่อแล้ว
  return { reportComment, isReporting, error, resetReportStatus };
};