export interface Report {
  id: string;
  reportNumber: number;
  reportedBy: string;
  reason: string;
  reportedDate: string;
  status: 'unreviewed' | 'reviewed';
  type: 'posts' | 'account';
  details: string;
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