"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommentData as Comment } from "@/model/PostDetailData";
import { CreateCommentForm } from "../modal/CreateCommentForm";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onCommentPosted?: () => void;
}

export function CommentItem({
  comment,
  isReply = false,
  onCommentPosted,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [commentVote, setCommentVote] = useState<Comment | null>(comment);

  const handleReplySuccess = () => {
    setIsReplying(false);
    onCommentPosted?.();
  };

  const handleVote = async (voteType: "up" | "down") => {
    if (!comment) return;

    try {
      await apiRequest(
        `http://api.forum.didan.id.vn/forum/comments/votes/add/${comment.id}?type=${voteType}`,
        {
          method: "POST",
        },
        true
      );

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
    } catch (error) {
      console.error("Failed to vote:", error);
      if (error instanceof Error) {
        toast({
          title: "Vote failed",
          description: error.message,
          variant: "destructive",
        });
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

  return (
    <div className={`space-y-4 ${isReply ? "ml-12" : ""}`}>
      <Card className="p-4">
        <div className="flex gap-4">
          <Avatar className="size-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${comment.author.username}`}
            />
            <AvatarFallback>
              {comment.author.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">{comment.author.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
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
                    <img
                      src={file}
                      alt={`Attachment ${index + 1}`}
                      className="object-cover"
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
