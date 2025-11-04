export interface Report {
  id: string;
  reportNumber: number;
  reportedBy: string;
  reason: string;
  reportedDate: string;
  status: 'unreviewed' | 'reviewed';
  type: 'posts' | 'comments' | 'account';
  targetContent?: {
    id: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
    likes: number;
    comments: number;
    solved: boolean;
  };
  targetUser?: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
}

export interface ApiPostReportResponse {
  success: boolean;
  count: number;
  data: {
    report_id: string;
    reporter_id: string;
    target_id: string;
    reason: string;
    status: string;
    created_at: string;
    reporter_name: string;
    post_title: string;
    post_owner_name: string;
  }[];
}

export interface ApiCommentReportResponse {
  success: boolean;
  count: number;
  data: {
    report_id: string;
    reporter_id: string;
    target_id: string;
    reason: string;
    status: string;
    created_at: string;
    reporter_name: string;
    comment_text: string;
    comment_owner_name: string;
  }[];
}

export interface ApiAccountReportResponse {
  success: boolean;
  count: number;
  data: {
    report_id: string;
    reporter_id: string;
    target_id: string;
    reason: string;
    status: string;
    created_at: string;
    reporter_name: string;
    target_name: string;
  }[];
}