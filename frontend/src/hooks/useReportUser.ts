import { useState } from 'react';

// 1. สร้าง Interface Payload ใหม่ให้ตรงกับ API (ไม่มี target_type)
interface ReportPayload {
  target_id: number;
  reason: string;
}

interface ReportApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useReportUser = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL  ;
  const reportUser = async (userId: string, reason: string): Promise<ReportApiResponse | undefined> => {
    setIsReporting(true);
    setError(null);

    const targetIdNumber = Number(userId);
    if (isNaN(targetIdNumber) || targetIdNumber <= 0) {
      const errMsg = "Invalid User ID provided for reporting.";
      setError(errMsg);
      setIsReporting(false);
      throw new Error(errMsg);
    }

    // 2. สร้าง Payload ใหม่ (มีแค่ target_id และ reason)
    const payload: ReportPayload = {
      target_id: targetIdNumber,
      reason: reason,
    };

    try {
      // 3. ยิงไปที่ Endpoint ใหม่ /reports/accounts
      const response = await fetch(`${API_BASE}/api/v1/reports/accounts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // API ใหม่มี Error "You cannot report yourself"
        if (response.status === 400 && responseData.message?.includes("report yourself")) {
            throw new Error(responseData.message);
        }
        if (response.status === 429) { // 429 Too Many Requests
          throw new Error(responseData.message || 'You have reported this user recently.');
        }
        throw new Error(responseData.message || 'Failed to report user');
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

  return { reportUser, isReporting, error, resetReportStatus };
};