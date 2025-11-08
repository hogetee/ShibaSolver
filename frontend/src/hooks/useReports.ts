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
      if (status === "unreviewed") {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admins/posts?status=pending`
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
              username: item.post_owner_username,
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
      } else {
        // Fetch both accepted and rejected reports
        const [acceptedRes, rejectedRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/v1/admins/posts?status=accepted`),
          fetch(`${BACKEND_URL}/api/v1/admins/posts?status=rejected`),
        ]);

        const acceptedData: ApiPostReportResponse = await acceptedRes.json();
        const rejectedData: ApiPostReportResponse = await rejectedRes.json();

        const combinedReports = [
          ...(acceptedData.success ? acceptedData.data : []),
          ...(rejectedData.success ? rejectedData.data : []),
        ];

        const mappedReports = combinedReports.map((item) => ({
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
            username: item.post_owner_username,
            tags: [],
            likes: 0,
            comments: 0,
            solved: false,
          },
        }));
        setReports(mappedReports);
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
      if (status === "unreviewed") {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admins/comments?status=pending`
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
              username: item.comment_owner_username,
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
      } else {
        // Fetch both accepted and rejected reports
        const [acceptedRes, rejectedRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/v1/admins/comments?status=accepted`),
          fetch(`${BACKEND_URL}/api/v1/admins/comments?status=rejected`),
        ]);

        const acceptedData: ApiCommentReportResponse = await acceptedRes.json();
        const rejectedData: ApiCommentReportResponse = await rejectedRes.json();

        const combinedReports = [
          ...(acceptedData.success ? acceptedData.data : []),
          ...(rejectedData.success ? rejectedData.data : []),
        ];

        const mappedReports = combinedReports.map((item) => ({
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
            username: item.comment_owner_username,
            tags: [],
            likes: 0,
            comments: 0,
            solved: false,
          },
        }));
        setReports(mappedReports);
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
      if (status === "unreviewed") {
        console.log(`Fetching account reports with status: pending`);
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admins/accounts?status=pending`
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
              username: item.target_username,
              display_name: item.target_name,
              email: "",
            },
          }));
          setReports(mappedReports);
        } else {
          setReports([]);
        }
      } else {
        // Fetch both accepted and rejected reports
        console.log(`Fetching account reports with status: accepted and rejected`);
        const [acceptedRes, rejectedRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/v1/admins/accounts?status=accepted`),
          fetch(`${BACKEND_URL}/api/v1/admins/accounts?status=rejected`),
        ]);

        console.log(`Accepted response status: ${acceptedRes.status}`);
        console.log(`Rejected response status: ${rejectedRes.status}`);

        if (!acceptedRes.ok || !rejectedRes.ok) {
          console.error("Error fetching reviewed account reports");
          setReports([]);
          return;
        }

        const acceptedText = await acceptedRes.text();
        const rejectedText = await rejectedRes.text();

        let acceptedData: ApiAccountReportResponse;
        let rejectedData: ApiAccountReportResponse;

        try {
          acceptedData = JSON.parse(acceptedText);
          rejectedData = JSON.parse(rejectedText);
        } catch (parseError) {
          console.error("JSON parse error for account reports:", parseError);
          setReports([]);
          return;
        }

        const combinedReports = [
          ...(acceptedData.success ? acceptedData.data : []),
          ...(rejectedData.success ? rejectedData.data : []),
        ];

        const mappedReports = combinedReports.map((item) => ({
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
            username: item.target_username,
            display_name: item.target_name,
            email: "",
          },
        }));
        setReports(mappedReports);
      }
    } catch (error) {
      console.error("Error fetching account reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    // Remove from UI immediately
    setReports((prev) => prev.filter((report) => report.id !== reportId));

    try {
      // Step 1: Delete the post, comment, or ban the user
      if (report.type === "posts" && report.targetContent?.id) {
        const deleteResponse = await fetch(
          `${BACKEND_URL}/api/v1/admins/posts/${report.targetContent.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!deleteResponse.ok) {
          console.error("Failed to delete post");
        } else {
          console.log(`Post ${report.targetContent.id} deleted successfully`);
        }
      } else if (report.type === "comments" && report.targetContent?.id) {
        const deleteResponse = await fetch(
          `${BACKEND_URL}/api/v1/admins/comments/${report.targetContent.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!deleteResponse.ok) {
          console.error("Failed to delete comment");
        } else {
          console.log(`Comment ${report.targetContent.id} deleted successfully`);
        }
      } else if (report.type === "account" && report.targetUser?.id) {
        // Ban the user for account reports
        const banResponse = await fetch(
          `${BACKEND_URL}/api/v1/admins/users/${report.targetUser.id}/ban`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );

        if (!banResponse.ok) {
          console.error("Failed to ban user");
        } else {
          console.log(`User ${report.targetUser.id} banned successfully`);
        }
      }


      const statusResponse = await fetch(
        `${BACKEND_URL}/api/v1/admins/accounts/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "accepted",
          }),
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Accept report API error:", errorText);
        throw new Error(`Failed to accept report (${statusResponse.status})`);
      }

      const result = await statusResponse.json();

      if (result.success) {
        console.log(`Report ${reportId} has been accepted`);
        return result;
      } else {
        console.error("Error accepting report:", result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  };


  const rejectReport = async (reportId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== reportId));

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admins/accounts/${reportId}/status`,
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
