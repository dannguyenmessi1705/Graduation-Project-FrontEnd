"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CommentItem } from "@/components/comment/CommentItem";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTopicContext } from "@/contexts/TopicContext";
import { useEffect, useState } from "react";
import type { PostDetailData, CommentData } from "@/model/PostDetailData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { ResponseStatus } from "@/model/ResponseStatus";
import { useAuth } from "@/contexts/AuthContext";
import { CreateCommentForm } from "@/components/modal/CreateCommentForm";

type PostDetail = {
  status: ResponseStatus | null;
  data: PostDetailData | null;
};

type Comment = {
  status: ResponseStatus | null;
  data: CommentData[] | null;
};

async function getPostDetail(postId: string): Promise<PostDetailData> {
  const res = (await apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/${postId}`
  )) as PostDetail;
  return res.data!;
}

async function getPostComments(
  postId: string,
  page: number = 0
): Promise<CommentData[]> {
  const res = (await apiRequest(
    `http://api.forum.didan.id.vn/forum/comments/post/${postId}?page=${page}`
  )) as Comment;
  return res.data || [];
}

async function votePost(
  postId: string,
  voteType: "up" | "down"
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/votes/add/${postId}?type=${voteType}`,
    {
      method: "POST",
    },
    true
  );
}

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const { topicName } = useTopicContext();
  const { handleExpiredToken } = useAuth();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          getPostDetail(params.id),
          getPostComments(params.id),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else {
          console.error("Failed to fetch thread data:", error);
        }
      }
    };
    fetchData();
  }, [params.id, handleExpiredToken]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!post) return;

    try {
      await votePost(post.id, voteType);

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          totalUpvotes:
            voteType === "up"
              ? prevPost.totalUpvotes + 1
              : prevPost.totalUpvotes,
          totalDownvotes:
            voteType === "down"
              ? prevPost.totalDownvotes + 1
              : prevPost.totalDownvotes,
        };
      });

      setUserVote(voteType);
      toast({
        title: "Vote successful",
        description: `You have ${voteType}voted this thread.`,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "TokenExpiredError") {
        handleExpiredToken();
      } else {
        console.error("Failed to vote:", error);
        toast({
          title: "Vote failed",
          description:
            "There was an error processing your vote. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCommentPosted = async () => {
    // Refresh comments
    try {
      const commentsData = await getPostComments(params.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="mb-2 text-sm text-muted-foreground">
          <nav className="flex gap-2">
            <a href="/" className="hover:text-blue-600">
              Forums
            </a>
            <span>›</span>
            <a href="/topics" className="hover:text-blue-600">
              Đại sảnh
            </a>
            <span>›</span>
            <a href={`/topics/${post.topicId}`} className="hover:text-blue-600">
              {topicName}
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100"
          >
            bài viết
          </Badge>
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex gap-4">
            <Avatar className="size-12">
              <AvatarImage
                src={`https://avatar.vercel.sh/${post.author.username}`}
              />
              <AvatarFallback>
                {post.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-medium">{post.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{post.content}</p>
                {post.fileAttachments.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={`Attachment ${index + 1}`}
                    className="mt-4 max-h-[500px] rounded-lg object-cover"
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <button
                  className={`flex items-center gap-1 text-sm ${userVote === "up" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => handleVote("up")}
                >
                  <ThumbsUp className="size-4" />
                  {post!.totalUpvotes}
                </button>
                <button
                  className={`flex items-center gap-1 text-sm ${userVote === "down" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => handleVote("down")}
                >
                  <ThumbsDown className="size-4" />
                  {post!.totalDownvotes}
                </button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  {post.totalComments} comments
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Comments ({post.totalComments})
          </h2>

          <Card className="p-4">
            <CreateCommentForm
              postId={post.id}
              onSuccess={handleCommentPosted}
            />
          </Card>

          <div className="space-y-4">
            {comments && comments.length !== 0
              ? comments.map((comment) =>
                  comment.replyToCommentId.length === 0 ? (
                    <div key={comment.id}>
                      <CommentItem
                        comment={comment}
                        onCommentPosted={handleCommentPosted}
                      />
                      {comments
                        .filter(
                          (reply) => reply.replyToCommentId === comment.id
                        )
                        .map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            onCommentPosted={handleCommentPosted}
                            isReply
                          />
                        ))}
                    </div>
                  ) : null
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
