"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Sparkles, Reply, FileIcon } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getJwtToken } from "@/lib/auth";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "@/components/Loading";
import { UserDetails as User } from "@/model/UserData";
import { CommentData as Comment } from "@/model/PostDetailData";
import { UserMentionSuggestions } from "@/components/comment/UserMentionSuggestions";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface CreateCommentFormProps {
  postId: string;
  replyToCommentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  postTitle?: string;
  postContent?: string;
  initialMention?: string;
  parentComment?: Comment | null;
}

const isImageFile = (fileName: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|svg)/i.test(fileName);
};

const isVideoFile = (fileName: string): string | null => {
  if (/\.(mp4)/i.test(fileName)) {
    return "mp4";
  } else if (/\.(webm)/i.test(fileName)) {
    return "webm";
  } else if (/\.(ogg)/i.test(fileName)) {
    return "ogg";
  } else if (/\.(mov)/i.test(fileName)) {
    return "mov";
  } else if (/\.(avi)/i.test(fileName)) {
    return "avi";
  } else return null;
};

export function CreateCommentForm({
  postId,
  replyToCommentId,
  onSuccess,
  onCancel,
  className = "",
  postTitle = "",
  postContent = "",
  initialMention = "",
  parentComment = null,
}: CreateCommentFormProps) {
  const [content, setContent] = useState(
    initialMention ? `**@${initialMention}** ` : ""
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
  const [mentionStart, setMentionStart] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current && initialMention) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, [initialMention, content.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("postId", postId);
    if (replyToCommentId) {
      formData.append("replyToCommentId", replyToCommentId);
    }
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = getJwtToken();
      const response = await fetch(
        "http://api.forum.didan.id.vn/forum/comments/create",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error("TokenExpiredError");
      }

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Comment posted",
          description: replyToCommentId
            ? "Your reply has been posted."
            : "Your comment has been posted.",
        });
        setContent("");
        setFiles([]);
        onSuccess?.();
      } else {
        throw new Error(data.message || "Failed to post comment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Hãy bình luận vui, ngắn gọn cho bài viết có tiêu đề "${postTitle}" với Nội dung "${postContent}"`;
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI response");
      }

      const data = await response.json();
      setContent((prevContent) => `${prevContent}${data.response}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value;
    setContent(newContent);

    const lastAtIndex = newContent.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex < newContent.length - 1) {
      const query = newContent.slice(lastAtIndex + 1).split(/\s/)[0];
      if (query.length >= 3) {
        setMentionQuery(query);
        setMentionStart(lastAtIndex);
        try {
          const response = await fetch(
            `http://api.forum.didan.id.vn/forum/users/find?keyword=${query}&page=0`
          );
          const data = await response.json();
          setMentionSuggestions(data.data);
        } catch (error) {
          console.error("Failed to fetch user suggestions:", error);
        }
      } else {
        setMentionSuggestions([]);
      }
    } else {
      setMentionSuggestions([]);
    }
  };

  const handleMentionSelect = (user: User) => {
    if (mentionStart !== -1) {
      const beforeMention = content.slice(0, mentionStart);
      const afterMention = content.slice(
        mentionStart + mentionQuery.length + 1
      );
      const newContent = `${beforeMention}**@${user.username}** ${afterMention}`;
      setContent(newContent);
      setMentionSuggestions([]);
      setMentionStart(-1);
      setMentionQuery("");
      if (textareaRef.current) {
        const newCursorPosition = mentionStart + user.username.length + 5;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }
  };

  const renderFilePreview = (file: File, index: number) => {
    if (isImageFile(file.name)) {
      return (
        <div
          key={index}
          className="relative aspect-video overflow-hidden rounded-lg border"
        >
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            fill
            className="object-cover"
          />
        </div>
      );
    } else if (isVideoFile(file.name)) {
      return (
        <div
          key={index}
          className="relative aspect-video overflow-hidden rounded-lg border"
        >
          <video controls className="size-full">
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <div key={index} className="flex items-center rounded-lg bg-muted p-2">
          <FileIcon className="mr-2 size-8 text-primary" />
          <span className="text-sm text-foreground">{file.name}</span>
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {parentComment && (
        <Card className="bg-muted/50 p-4">
          <div className="text-sm text-muted-foreground">
            Replying to{" "}
            <Link
              href={`/user/${parentComment.author.id}`}
              className="text-primary hover:underline"
            >
              @{parentComment.author.username}
            </Link>
            :
          </div>
          <div className="mt-2 line-clamp-2 text-sm">
            {parentComment.content}
          </div>
        </Card>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="content">Your Comment</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateAIContent}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loading size={16} color="primary" />
          ) : (
            <>
              <Sparkles className="mr-2 size-4" />
              Generate with AI
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <Textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder={
            replyToCommentId ? "Write your reply..." : "Write your comment..."
          }
          className="min-h-[100px] transition-all duration-200 focus:shadow-md"
          required
          ref={textareaRef}
        />
        {mentionSuggestions && mentionSuggestions.length > 0 && (
          <UserMentionSuggestions
            users={mentionSuggestions}
            onSelect={handleMentionSelect}
            onClose={() => setMentionSuggestions([])}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            id="comment-files"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
            // accept="image/*"
          />
          <Label
            htmlFor="comment-files"
            className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors duration-200 hover:bg-accent"
          >
            <Upload className="size-4" />
            Add Files
          </Label>
          <span className="text-sm text-muted-foreground">
            {files.length} file(s) selected
          </span>
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              className="mt-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderFilePreview(file, index)}
                  <motion.button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground transition-colors duration-200 hover:bg-background"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="size-4" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loading size={16} color="primary-foreground" />
          ) : replyToCommentId ? (
            <>
              <Reply className="mr-2 size-4" />
              Reply
            </>
          ) : (
            "Comment"
          )}
        </Button>
      </div>
    </form>
  );
}
