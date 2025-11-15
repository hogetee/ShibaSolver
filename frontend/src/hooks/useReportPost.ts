import { useState } from 'react';

// Interface สำหรับข้อมูลที่จะส่งไป Report
interface ReportPayload {
  target_type: 'post' | 'comment'; // ตอนนี้เราจะใช้แค่ 'post'
  target_id: number;
  reason: string;
}

// Interface สำหรับ Response จาก API (ถ้ามี)
interface ReportApiResponse {
  success: boolean;
  message: string;
  data?: any; // ข้อมูล report ที่สร้างเสร็จ (ถ้า API ส่งกลับมา)
}

export const useReportPost = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reportPost = async (postId: string, reason: string): Promise<ReportApiResponse | undefined> => {
    setIsReporting(true);
    setError(null);
    setSuccessMessage(null);

    // ตรวจสอบว่า postId เป็นตัวเลขที่ถูกต้องหรือไม่
    const targetIdNumber = Number(postId);
    if (isNaN(targetIdNumber) || targetIdNumber <= 0) {
      const errMsg = "Invalid Post ID provided for reporting.";
      setError(errMsg);
      setIsReporting(false);
      throw new Error(errMsg); // โยน Error ให้ Component จัดการต่อ
    }

    const payload: ReportPayload = {
      target_type: 'post',
      target_id: targetIdNumber,
      reason: reason,
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL  ;

    try {
      const response = await fetch(`${API_BASE}/api/v1/reports/content`, {
        method: 'POST',
        credentials: 'include', // สำคัญมาก! สำหรับส่ง Cookie ยืนยันตัวตน
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // จัดการ Error เฉพาะ (เช่น 429 Too Many Requests)
        if (response.status === 429) {
          throw new Error(responseData.message || 'You have reported this post recently.');
        }
        throw new Error(responseData.message || 'Failed to report post');
      }

      setSuccessMessage(responseData.message || 'Post reported successfully');
      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw err; // ส่ง Error ต่อเพื่อให้ Component ที่เรียกใช้จัดการต่อได้
    } finally {
      setIsReporting(false);
    }
  };

  // เพิ่มฟังก์ชันสำหรับ Reset สถานะ Success/Error (ถ้าต้องการ)
  const resetReportStatus = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return { reportPost, isReporting, error, successMessage, resetReportStatus };
};