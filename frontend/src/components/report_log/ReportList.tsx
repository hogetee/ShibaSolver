import ReportCard from "./ReportCard";
import useReports from "@/hooks/useReports";
import { useEffect } from "react";

type ReviewStatus = "unreviewed" | "reviewed";
type ReportType = "posts" | "account";

export default function ReportList(
  reviewStatus: ReviewStatus,
  reportType: ReportType
) {
  const { reports, loading, fetchReports, removeReport, rejectReport } =
    useReports();

  useEffect(() => {
    fetchReports(reviewStatus, reportType);
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
            <ReportCard
              key={report.id}
              report={report}
              onRemove={removeReport}
              onReject={rejectReport}
            />
          ))
        )}
      </div>
    </div>
  );
}
