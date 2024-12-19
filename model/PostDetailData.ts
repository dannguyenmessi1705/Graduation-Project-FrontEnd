export interface Author {
  id: string;
  username: string;
  email: string;
}

export interface PostDetailData {
  id: string;
  title: string;
  content: string;
  topicId: string;
  author: Author;
  fileAttachments: string[];
  totalComments: number;
  totalUpvotes: number;
  totalDownvotes: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CommentData {
  id: string;
  postId: string;
  replyToCommentId: string;
  author: Author;
  content: string;
  totalUpvotes: number;
  totalDownvotes: number;
  fileAttachments: string[];
  createdAt: string;
  updatedAt: string | null;
}