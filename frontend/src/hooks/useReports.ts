import { useState } from "react";
import { Report } from "@/components/report_log/ReportType";
export default function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchReports = (
    status: "unreviewed" | "reviewed",
    type: "posts" | "comments" | "account"
  ) => {
    setLoading(true);

    //subject to change to actually report api
    const filtered = mockReports.filter(
      (report) => report.status === status && report.type === type
    );

    setTimeout(() => {
      setReports(filtered);
      setLoading(false);
    }, 500);
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
