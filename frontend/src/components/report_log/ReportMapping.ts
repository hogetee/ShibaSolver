import { Report } from "./ReportType";
import { ApiPostReportResponse, ApiAccountReportResponse, ApiCommentReportResponse } from "./ReportType";
import { userService } from "@/utils/userService";

function mapPostReport(item: ApiPostReportResponse['data'][0]): Report {
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

function mapCommentReport(item: ApiCommentReportResponse['data'][0]): Report {
  return {
    id: item.report_id,
    reportNumber: parseInt(item.report_id),
    reportedBy: item.reporter_name,
    reason: item.reason,
    reportedDate: new Date(item.created_at).toLocaleDateString('en-GB'),
    status: item.status === 'pending' ? 'unreviewed' as const : 'reviewed' as const,
    type: "comments" as const,
    targetContent: {
      id: item.target_id,
      title: "Comment", // Comments don't have titles
      content: item.comment_text,
      author: item.comment_owner_name,
      tags: [],
      likes: 0,
      comments: 0,
      solved: false,
    },
  };
}

function mapAccountReport(item: ApiAccountReportResponse['data'][0]): Report {
  return {
    id: item.report_id,
    reportNumber: parseInt(item.report_id),
    reportedBy: item.reporter_name,
    reason: item.reason,
    reportedDate: new Date(item.created_at).toLocaleDateString('en-GB'),
    status: item.status === 'pending' ? 'unreviewed' as const : 'reviewed' as const,
    type: "account" as const,
    targetUser: {
      id: item.target_id,
      username: item.target_name,
      email: "", // Not provided by API
    },
  };
}

export function mapApiResponseToReports(
  apiData: ApiPostReportResponse['data'] | ApiCommentReportResponse['data'] | ApiAccountReportResponse['data'],
  type: 'posts' | 'comments' | 'account'
): Report[] {
  switch (type) {
    case 'posts':
      return (apiData as ApiPostReportResponse['data']).map(item => mapPostReport(item));
    case 'comments':
      return (apiData as ApiCommentReportResponse['data']).map(item => mapCommentReport(item));
    case 'account':
      return (apiData as ApiAccountReportResponse['data']).map(item => mapAccountReport(item));
    default:
      return [];
  }
}