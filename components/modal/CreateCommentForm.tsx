"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Sparkles, Reply } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getJwtToken } from "@/lib/auth";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "@/components/Loading";

interface CreateCommentFormProps {
  postId: string;
  replyToCommentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  postTitle?: string;
  postContent?: string;
}

export function CreateCommentForm({
  postId,
  replyToCommentId,
  onSuccess,
  onCancel,
  className = "",
  postTitle = "",
  postContent = "",
}: CreateCommentFormProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
      setContent(data.response);
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

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
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
      <Textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          replyToCommentId ? "Write your reply..." : "Write your comment..."
        }
        className="min-h-[100px] transition-all duration-200 focus:shadow-md"
        required
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            id="comment-files"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
          />
          <Label
            htmlFor="comment-files"
            className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors duration-200 hover:bg-accent"
          >
            <Upload className="size-4" />
            Add Images
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
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1 transition-colors duration-200 hover:bg-background"
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
