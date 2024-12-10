"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommentData } from "@/model/PostDetailData";
import { useState } from "react";
import { voteComment } from "@/rest/commentApi";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface CommentItemProps {
  comment: CommentData;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [commentVote, setCommentVote] = useState<CommentData | null>(comment);
  const { toast } = useToast();
  const { data } = useSession();

  const handleVote = async (voteType: "up" | "down") => {
    if (!comment) return;

    try {
      await voteComment(comment.id, voteType, data?.accessToken);

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
        description: `You have ${voteType}voted this thread.`,
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
    <Card className={`p-4 ${isReply ? "ml-12" : ""}`}>
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
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="whitespace-pre-line text-sm">{comment.content}</p>
          <div className="mt-2 flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </Card>
  );
}
