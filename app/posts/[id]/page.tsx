"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CommentItem } from "@/components/comment/CommentItem";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTopicContext } from "@/contexts/TopicContext";
import type { PostDetailData, CommentData } from "@/model/PostDetailData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, deletePost, getUserDetails, revokeVote } from "@/lib/api";
import { ResponseStatus } from "@/model/ResponseStatus";
import { useAuth } from "@/contexts/AuthContext";
import { CreateCommentForm } from "@/components/modal/CreateCommentForm";
import Image from "next/image";
import Link from "next/link";
import { EditPostModal } from "@/components/modal/EditPostModal";
import { Button } from "@/components/ui/button";

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

const fetchData = async (postId: string) => {
  try {
    const [postData, commentsData] = await Promise.all([
      getPostDetail(postId as string),
      getPostComments(postId as string),
    ]);
    return { postData, commentsData };
  } catch (error) {
    console.error("Failed to fetch thread data:", error);
    throw error;
  }
};

export default function PostPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const highlightedCommentId = searchParams.get("highlightedCommentId");
  const { topicName } = useTopicContext();
  const { handleExpiredToken, userDetails } = useAuth();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const highlightedCommentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(id as string);
        setPost(data.postData);
        setComments(data.commentsData);

        const authorDetails = await getUserDetails(data.postData.author.id);
        setAvatarUrl(authorDetails.data.picture);
      } catch (error) {
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else {
          console.error("Failed to fetch thread data:", error);
        }
      }
    };
    loadData();
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
      if (userVote === voteType) {
        await revokeVote("post", post.id);
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            totalUpvotes:
              voteType === "up"
                ? prevPost.totalUpvotes - 1
                : prevPost.totalUpvotes,
            totalDownvotes:
              voteType === "down"
                ? prevPost.totalDownvotes - 1
                : prevPost.totalDownvotes,
          };
        });
        setUserVote(null);
        toast({
          title: "Vote revoked",
          description: `Your ${voteType} vote has been revoked`,
        });
      } else {
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
          setUserVote(voteType);
          toast({
            title: "Vote successful",
            description: `You have ${voteType} voted this thread.`,
          });
        });
      }
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

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post!.id);
        toast({
          title: "Post deleted",
          description: "Your post has been deleted.",
        });
        router.push(`/topics/${post!.topicId}`);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to delete post",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditSuccess = async () => {
    try {
      const { postData, commentsData } = await fetchData(id as string);
      setPost(postData);
      setComments(commentsData);
      toast({
        title: "Post updated successfully",
        description: "Your post has been updated.",
      });
    } catch (error) {
      console.error("Failed to refresh thread data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh the thread data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCommentDeleted = async (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );
    if (post) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setPost((prevPost) => ({
        ...prevPost,
        totalComments: prevPost!.totalComments - 1,
      }));
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 lg:px-16 xl:px-24">
      <div className="mb-4 md:mb-6">
        <div className="mb-2 text-sm text-muted-foreground">
          <nav className="flex flex-wrap gap-2">
            <a href="/" className="hover:text-blue-600">
              Forums
            </a>
            <span>›</span>
            <a href={`/topics/${post.topicId}`} className="hover:text-blue-600">
              {topicName}
            </a>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100"
          >
            bài viết
          </Badge>
          <h1 className="text-xl font-bold md:text-2xl">{post.title}</h1>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <Card className="p-4 md:p-6">
          <div className="flex gap-4">
            <Link href={`/user/${post.author.id}`}>
              <Avatar className="size-12">
                <AvatarImage
                  src={avatarUrl ? decodeURIComponent(avatarUrl) : ""}
                />
                <AvatarFallback>
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
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
                      src={decodeURIComponent(file)}
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
                  className={`flex items-center gap-1 text-sm ${userVote === "up" ? "font-bold text-primary" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => handleVote("up")}
                >
                  <ThumbsUp
                    className={`size-4 ${userVote === "up" ? "fill-current" : ""}`}
                  />
                  {post!.totalUpvotes}
                </button>
                <button
                  className={`flex items-center gap-1 text-sm ${userVote === "down" ? "font-bold text-primary" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => handleVote("down")}
                >
                  <ThumbsDown className="size-4" />
                  {post!.totalDownvotes}
                </button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare
                    className={`size-4 ${userVote === "down" ? "fill-current" : ""}`}
                  />
                  {post.totalComments} comments
                </div>
                {userDetails?.id === post.author.id && (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleEditPost}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeletePost}
                    >
                      Delete
                    </Button>
                  </>
                )}
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
                        onCommentDeleted={handleCommentDeleted}
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
                            onCommentDeleted={handleCommentDeleted}
                          />
                        ))}
                    </div>
                  ) : null
                )
              : null}
          </div>
        </div>
      </div>
      {post && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          postId={post.id}
          initialTitle={post.title}
          initialContent={post.content}
          initialFiles={post.fileAttachments}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
