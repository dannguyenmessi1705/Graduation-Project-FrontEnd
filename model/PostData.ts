export type PostData = {
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
};

type Author = {
  id: string;
  username: string;
  email: string;
};
