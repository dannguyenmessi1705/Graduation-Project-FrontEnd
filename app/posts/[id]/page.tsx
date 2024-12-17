"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CommentItem } from "@/components/comment/CommentItem";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTopicContext } from "@/contexts/TopicContext";
import type { PostDetailData, CommentData } from "@/model/PostDetailData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getUserDetails } from "@/lib/api";
import { ResponseStatus } from "@/model/ResponseStatus";
import { useAuth } from "@/contexts/AuthContext";
import { CreateCommentForm } from "@/components/modal/CreateCommentForm";
import Image from "next/image";

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

export default function PostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const highlightedCommentId = searchParams.get("highlightedCommentId");
  const { topicName } = useTopicContext();
  const { handleExpiredToken } = useAuth();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const highlightedCommentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          getPostDetail(id as string),
          getPostComments(id as string),
        ]);
        setPost(postData);
        setComments(commentsData);
        const authorDetails = await getUserDetails(postData.author.id);
        setAvatarUrl(authorDetails.data.picture);
      } catch (error) {
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else {
          console.error("Failed to fetch thread data:", error);
        }
      }
    };
    fetchData();
  }, [id, handleExpiredToken]);

  useEffect(() => {
    if (highlightedCommentId && highlightedCommentRef.current) {
      highlightedCommentRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [highlightedCommentId, comments]);

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
      const commentsData = await getPostComments(id as string);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 lg:px-16 xl:px-24">
      <div className="mb-6">
        <div className="mb-2 text-sm text-muted-foreground">
          <nav className="flex gap-2">
            <a href="/" className="hover:text-blue-600">
              Forums
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
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {post.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-medium">{post.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(
                    new Date(
                      new Date(post.createdAt).getTime() + 7 * 60 * 60 * 1000
                    )
                  )}{" "}
                  ago
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{post.content}</p>
                {post.fileAttachments.map((file, index) => (
                  <div
                    key={index}
                    className="relative mt-4 aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={file}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
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
                  comment.replyToCommentId === null ? (
                    <div
                      key={comment.id}
                      ref={
                        comment.id === highlightedCommentId
                          ? highlightedCommentRef
                          : null
                      }
                    >
                      <CommentItem
                        comment={comment}
                        onCommentPosted={handleCommentPosted}
                        isHighlighted={comment.id === highlightedCommentId}
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
                            isHighlighted={reply.id === highlightedCommentId}
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
