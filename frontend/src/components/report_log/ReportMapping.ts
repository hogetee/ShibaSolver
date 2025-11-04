import { Report } from "./ReportType";
import { ApiReportResponse } from "./ReportType";

function mapSpecificReport(item: ApiReportResponse['data'][0]): Report {
  return {
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
    };
}

export function mapApiResponseToReports(apiData: ApiReportResponse['data']): Report[] {
  return apiData.map((item, index) => ({
        ...mapSpecificReport(item),
  }));
}