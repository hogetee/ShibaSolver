import { useState } from "react";
import { Report } from "@/components/report_log/ReportType";
import { ApiReportResponse } from "@/components/report_log/ReportType";

export default function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const mapApiResponseToReports = (apiData: ApiReportResponse['data']): Report[] => {
    return apiData.map((item, index) => ({
      id: item.report_id,
      reportNumber: parseInt(item.report_id),
      reportedBy: item.reporter_name,
      reason: item.reason,
      reportedDate: new Date(item.created_at).toLocaleDateString('en-GB'),
      status: item.status === 'pending' ? 'unreviewed' as const : 'reviewed' as const,
      type: "posts" as const,
      targetContent: {
        id: item.target_id,
        title: item.post_title,
        content: "", // Not provided by API
        author: item.post_owner_name,
        tags: [], // Not provided by API
        likes: 0, // Not provided by API
        comments: 0, // Not provided by API
        solved: false, // Not provided by API
      },
    }));
  };

  const mockReports: Report[] = [
    {
      id: "1",
      reportNumber: 23,
      reportedBy: "namanam",
      reason: "Offensive Content",
      reportedDate: "31/10/25",
      status: "unreviewed",
      type: "posts",
      targetContent: {
        id: "1",
        title: "How to solve these quadratic equations",
        content: "I need help with factoring x²+5x+6=0",
        author: "Best",
        tags: ["Unsolved", "Math"],
        likes: 12,
        comments: 4,
        solved: false,
      },
    },
    {
      id: "2",
      reportNumber: 22,
      reportedBy: "admin",
      reason: "Spam Account",
      reportedDate: "30/10/25",
      status: "unreviewed",
      type: "account",
      targetUser: {
        id: "2",
        username: "spammer123",
        email: "spam@example.com",
      },
    },
  ];

  const fetchReports = async (
    status: "unreviewed" | "reviewed",
    type: "posts" | "comments" | "account"
  ) => {
    setLoading(true);

    try {
      const apiStatus = status === "unreviewed" ? "pending" : "accepted";
      const response = await fetch(`http://localhost:5003/api/v1/admins/${type}?status=${apiStatus}`);
      const data: ApiReportResponse = await response.json();
      
      if (data.success) {
        const mappedReports = mapApiResponseToReports(data.data);
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const rejectReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: 'reviewed' as const } : report
    ));
  };

  return {
    reports,
    loading,
    fetchReports,
    removeReport,
    rejectReport,
  }
}
