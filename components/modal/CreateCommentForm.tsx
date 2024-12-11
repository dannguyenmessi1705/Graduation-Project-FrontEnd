"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Loader2, Reply } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getJwtToken } from "@/lib/auth";

interface CreateCommentFormProps {
  postId: string;
  replyToCommentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function CreateCommentForm({
  postId,
  replyToCommentId,
  onSuccess,
  onCancel,
  className = "",
}: CreateCommentFormProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          replyToCommentId ? "Write your reply..." : "Write your comment..."
        }
        className="min-h-[100px]"
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
            className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent"
          >
            <Upload className="h-4 w-4" />
            Add Images
          </Label>
          <span className="text-sm text-muted-foreground">
            {files.length} file(s) selected
          </span>
        </div>

        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div key={index} className="group relative">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {replyToCommentId ? (
            <>
              <Reply className="mr-2 h-4 w-4" />
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
