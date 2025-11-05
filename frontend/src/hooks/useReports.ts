import { useState } from "react";
import { Report } from "@/components/report_log/ReportType";
import {
  ApiPostReportResponse,
  ApiCommentReportResponse,
  ApiAccountReportResponse,
} from "@/components/report_log/ReportType";

export default function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

  const fetchPostReports = async (status: "unreviewed" | "reviewed") => {
    setLoading(true);
    try {
      const apiStatus = status === "unreviewed" ? "pending" : "accepted";
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admins/posts?status=${apiStatus}`
      );
      const data: ApiPostReportResponse = await response.json();

      if (data.success) {
        const mappedReports = data.data.map((item) => ({
          id: item.report_id,
          reportNumber: parseInt(item.report_id),
          reportedBy: item.reporter_name,
          reason: item.reason,
          reportedDate: new Date(item.created_at).toLocaleDateString("en-GB"),
          status:
            item.status === "pending"
              ? ("unreviewed" as const)
              : ("reviewed" as const),
          type: "posts" as const,
          targetContent: {
            id: item.target_id,
            title: item.post_title,
            content: "",
            author: item.post_owner_name,
            tags: [],
            likes: 0,
            comments: 0,
            solved: false,
          },
        }));
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching post reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentReports = async (status: "unreviewed" | "reviewed") => {
    setLoading(true);
    try {
      const apiStatus = status === "unreviewed" ? "pending" : "accepted";
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admins/comments?status=${apiStatus}`
      );
      const data: ApiCommentReportResponse = await response.json();

      if (data.success) {
        const mappedReports = data.data.map((item) => ({
          id: item.report_id,
          reportNumber: parseInt(item.report_id),
          reportedBy: item.reporter_name,
          reason: item.reason,
          reportedDate: new Date(item.created_at).toLocaleDateString("en-GB"),
          status:
            item.status === "pending"
              ? ("unreviewed" as const)
              : ("reviewed" as const),
          type: "comments" as const,
          targetContent: {
            id: item.target_id,
            title: "Comment",
            content: item.comment_text,
            author: item.comment_owner_name,
            tags: [],
            likes: 0,
            comments: 0,
            solved: false,
          },
        }));
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching comment reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountReports = async (status: "unreviewed" | "reviewed") => {
    setLoading(true);
    try {
      const apiStatus = status === "unreviewed" ? "pending" : "accepted";
      console.log(`Fetching account reports with status: ${apiStatus}`);
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admins/accounts?status=${apiStatus}`
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Account reports API error:", errorText);
        setReports([]);
        return;
      }

      const responseText = await response.text();
      console.log("Account reports raw response:", responseText);

      let data: ApiAccountReportResponse;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed account reports data:", data);
      } catch (parseError) {
        console.error("JSON parse error for account reports:", parseError);
        console.error("Failed to parse:", responseText);
        setReports([]);
        return;
      }

      if (data.success) {
        const mappedReports = data.data.map((item) => ({
          id: item.report_id,
          reportNumber: parseInt(item.report_id),
          reportedBy: item.reporter_name,
          reason: item.reason,
          reportedDate: new Date(item.created_at).toLocaleDateString("en-GB"),
          status:
            item.status === "pending"
              ? ("unreviewed" as const)
              : ("reviewed" as const),
          type: "account" as const,
          targetUser: {
            id: item.target_id,
            username: item.target_name,
            email: "",
          },
        }));
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching account reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (reportId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== reportId));
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/admins/accounts/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
        // No auth needed since you bypassed admin auth
      },
      body: JSON.stringify({
        status: 'accepted'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`Report ${reportId} has been accepted`);
      return result;
    } else {
      console.log('Error accepting report:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
    
};


  const rejectReport = async (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status: "reviewed" as const }
          : report
      )
    );

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admins/accounts/reports/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected",
          }),
        }
      );

      console.log(`Reject report response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Reject report API error:", errorText);
        return;
      }

      const responseText = await response.text();
      console.log("Reject report raw response:", responseText);

      if (responseText) {
        try {
          const result = JSON.parse(responseText);
          console.log("Parsed reject report result:", result);
          
          if (result.success) {
            console.log(`Report ${reportId} has been rejected`);
            return result;
          } else {
            console.error("Error rejecting report:", result.message);
          }
        } catch (parseError) {
          console.error("JSON parse error for reject report:", parseError);
          console.error("Failed to parse:", responseText);
        }
      } else {
        console.log("Empty response from reject report API");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };


  return {
    reports,
    loading,
    fetchPostReports,
    fetchCommentReports,
    fetchAccountReports,
    removeReport,
    rejectReport,
  };
}
