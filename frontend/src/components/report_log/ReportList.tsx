import ReportCard from "./ReportCard";
import useReports from "@/hooks/useReports";
import { useEffect } from "react";
import AccountReportCard from "./AccountReportCard";
type ReviewStatus = "unreviewed" | "reviewed";
type ReportType = "posts" | "comments" | "account";

export default function ReportList(
  reviewStatus: ReviewStatus,
  reportType: ReportType
) {
  const { reports, loading, fetchPostReports, fetchCommentReports, fetchAccountReports, removeReport, rejectReport } =
    useReports();

  useEffect(() => {
    if (reportType === "posts") {
      fetchPostReports(reviewStatus);
    } else if (reportType === "comments") {
      fetchCommentReports(reviewStatus);
    } else if (reportType === "account") {
      fetchAccountReports(reviewStatus);
    }
  }, [reviewStatus, reportType]);

  return (
    <div>
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500 text-center">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500 text-center">
              No {reviewStatus} {reportType} reports found
            </p>
          </div>
        ) : (
          reports.map((report) => (
            reportType === "account" ? (
              <AccountReportCard
                key={report.id}
                report={report}
                onRemove={removeReport}
                onReject={rejectReport}
              />
            ) : (
              <ReportCard
                key={report.id}
                report={report}
                onRemove={removeReport}
                onReject={rejectReport}
              />
            )
          ))
        )}
      </div>
    </div>
  );
}
