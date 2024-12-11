"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommentData as Comment } from "@/model/PostDetailData";
import { CreateCommentForm } from "../modal/CreateCommentForm";
import { Button } from "../ui/button";

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

  const handleReplySuccess = () => {
    setIsReplying(false);
    onCommentPosted?.();
  };

  return (
    <div className={`space-y-4 ${isReply ? "ml-12" : ""}`}>
      <Card className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
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
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ThumbsUp className="h-4 w-4" />
                {comment.totalUpvotes}
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ThumbsDown className="h-4 w-4" />
                {comment.totalDownvotes}
              </button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  <Reply className="mr-1 h-4 w-4" />
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
