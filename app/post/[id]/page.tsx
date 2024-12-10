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
import { ResponseStatus } from "@/model/ResponseStatus";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { votePost } from "@/rest/postApi";
import { useSession } from "next-auth/react";

type PostDetail = {
  status: ResponseStatus | null;
  data: PostDetailData | null;
};

type Comment = {
  status: ResponseStatus | null;
  data: CommentData[] | null;
};

async function getPostDetail(postId: string): Promise<PostDetail> {
  const res = await fetch(`http://api.forum.didan.id.vn/forum/posts/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch post detail");
  return res.json();
}

async function getPostComments(
  postId: string,
  page: number = 0
): Promise<Comment> {
  const res = await fetch(
    `http://api.forum.didan.id.vn/forum/comments/post/${postId}?page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const { topicName } = useTopicContext();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const { toast } = useToast();
  const { data } = useSession();

  useEffect(() => {
    getPostDetail(params.id).then(setPost);
    getPostComments(params.id).then(setComments);
  }, [params.id]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!post) return;

    try {
      await votePost(post!.data!.id, voteType, data?.accessToken);

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          totalUpvotes:
            voteType === "up"
              ? prevPost!.data!.totalUpvotes + 1
              : prevPost!.data!.totalUpvotes,
          totalDownvotes:
            voteType === "down"
              ? prevPost!.data!.totalDownvotes + 1
              : prevPost!.data!.totalDownvotes
        };
      });

      setUserVote(voteType);
      toast({
        title: "Vote successful",
        description: `You have ${voteType}voted this thread.`
      });
    } catch (error) {
      console.error("Failed to vote:", error);
      toast({
        title: "Vote failed",
        description:
          "There was an error processing your vote. Please try again.",
        variant: "destructive"
      });
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
            <a
              href={`/topics/${post.data!.topicId}`}
              className="hover:text-blue-600"
            >
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
          <h1 className="text-2xl font-bold">{post.data!.title}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex gap-4">
            <Avatar className="size-12">
              <AvatarImage
                src={`https://avatar.vercel.sh/${post.data!.author.username}`}
              />
              <AvatarFallback>
                {post.data!.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-medium">
                  {post.data!.author.username}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.data!.createdAt))} ago
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{post.data!.content}</p>
                {post.data!.fileAttachments.map((file, index) => (
                  <Image
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
                  {post!.data!.totalUpvotes}
                </button>
                <button
                  className={`flex items-center gap-1 text-sm ${userVote === "down" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => handleVote("down")}
                >
                  <ThumbsDown className="size-4" />
                  {post!.data!.totalDownvotes}
                </button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  {post.data!.totalComments} comments
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Comments ({post.data!.totalComments})
          </h2>
          {comments?.data && comments.data.length !== 0
            ? comments!.data!.map((comment) =>
              comment.replyToCommentId.length === 0 ? (
                <div key={comment.id}>
                  <CommentItem comment={comment} />
                  {comments!
                    .data!.filter(
                    (reply) => reply.replyToCommentId === comment.id
                  )
                  .map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              ) : null
            )
            : null}
        </div>
      </div>
    </div>
  );
}
