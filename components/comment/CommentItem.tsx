"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Reply, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommentData as Comment } from "@/model/PostDetailData";
import { CreateCommentForm } from "../modal/CreateCommentForm";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  apiRequest,
  getUserDetails,
  deleteComment,
  revokeVote,
} from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onCommentPosted?: () => void;
  isHighlighted?: boolean;
  onCommentDeleted: (commentId: string) => void;
  handleExpiredToken: () => void;
}

async function voteComment(
  commentId: string,
  voteType: "up" | "down"
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/comments/votes/add/${commentId}?type=${voteType}`,
    {
      method: "POST",
    },
    true
  );
}

export function CommentItem({
  comment,
  isReply = false,
  onCommentPosted,
  isHighlighted = false,
  onCommentDeleted,
  handleExpiredToken,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [commentVote, setCommentVote] = useState<Comment | null>(comment);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const { userDetails } = useAuth();

  const handleReplySuccess = () => {
    setIsReplying(false);
    onCommentPosted?.();
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(comment.author.id);
        setAvatarUrl(userDetails.data.picture);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUserDetails();
  }, [comment.author.id]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!comment) return;

    try {
      if (userVote === voteType) {
        await revokeVote("comment", comment.id);
        setCommentVote((prevComment) => {
          if (!prevComment) return null;
          return {
            ...prevComment,
            totalUpvotes:
              voteType === "up"
                ? prevComment.totalUpvotes - 1
                : prevComment.totalUpvotes,
            totalDownvotes:
              voteType === "down"
                ? prevComment.totalDownvotes - 1
                : prevComment.totalDownvotes,
          };
        });
        setUserVote(null);
        toast({
          title: "Vote revoked",
          description: `Your ${voteType} vote has been revoked`,
        });
      } else {
        await voteComment(comment.id, voteType);
        setCommentVote((prevComment) => {
          if (!prevComment) return null;
          return {
            ...prevComment,
            totalUpvotes:
              voteType === "up"
                ? prevComment.totalUpvotes + 1
                : prevComment.totalUpvotes,
            totalDownvotes:
              voteType === "down"
                ? prevComment.totalDownvotes + 1
                : prevComment.totalDownvotes,
          };
        });
        setUserVote(voteType);
        toast({
          title: "Vote successful",
          description: `You have ${voteType} voted this thread.`,
        });
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      if (error instanceof Error) {
        if (error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else if (error.message === "ApiError") {
          await revokeVote("comment", comment.id);
          setCommentVote((prevComment) => {
            if (!prevComment) return null;
            return {
              ...prevComment,
              totalUpvotes:
                voteType === "up"
                  ? prevComment.totalUpvotes - 1
                  : prevComment.totalUpvotes,
              totalDownvotes:
                voteType === "down"
                  ? prevComment.totalDownvotes - 1
                  : prevComment.totalDownvotes,
            };
          });
          setUserVote(null);
          toast({
            title: "Vote revoked",
            description: `Your ${voteType} vote has been revoked`,
          });
        }
      } else {
        toast({
          title: "Vote failed",
          description:
            "There was an error processing your vote. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(comment.id);
        toast({
          title: "Comment deleted",
          description: "Your comment has been successfully deleted.",
        });
        onCommentDeleted(comment.id);
      } catch (error) {
        console.error("Failed to delete comment:", error);
        toast({
          title: "Delete failed",
          description:
            "There was an error deleting your comment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={`space-y-4 ${isReply ? "ml-12" : ""}`}>
      <Card className={`p-4 ${isHighlighted ? "border-2 border-primary" : ""}`}>
        <div className="flex gap-4">
          <Link href={`/user/${comment.author.id}`}>
            <Avatar className="size-10">
              <AvatarImage
                src={avatarUrl ? decodeURIComponent(avatarUrl) : ""}
              />
              <AvatarFallback>
                {comment.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">{comment.author.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(
                  new Date(
                    new Date(comment.createdAt).getTime() + 7 * 60 * 60 * 1000
                  )
                )}{" "}
                ago
              </span>
            </div>
            <p className="whitespace-pre-line text-sm">{comment.content}</p>
            {comment.fileAttachments && comment.fileAttachments.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {comment.fileAttachments.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg border"
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
            )}
            <div className="mt-4 flex items-center gap-4">
              <button
                className={`flex items-center gap-1 text-sm ${userVote === "up" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
                onClick={() => handleVote("up")}
              >
                <ThumbsUp className="size-4" />
                {commentVote!.totalUpvotes}
              </button>
              <button
                className={`flex items-center gap-1 text-sm ${userVote === "down" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
                onClick={() => handleVote("down")}
              >
                <ThumbsDown className="size-4" />
                {commentVote!.totalDownvotes}
              </button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  <Reply className="mr-1 size-4" />
                  Reply
                </Button>
              )}
              {userDetails?.id === comment.author.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-destructive"
                  onClick={handleDeleteComment}
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {isReplying && (
        <div className="ml-12">
          <CreateCommentForm
            postId={comment.postId}
            replyToCommentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}
    </div>
  );
}
