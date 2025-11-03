export default function ReportList(reviewStatus: string, reportType: string) {
  return (
    <div>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500 text-center">
            Showing {reviewStatus}{" "}
            {reportType === "posts" ? "posts/comments" : "account"} reports
          </p>
        </div>
      </div>
    </div>
  );
}
