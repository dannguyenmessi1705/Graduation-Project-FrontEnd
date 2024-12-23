"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { getJwtToken } from "@/lib/auth";
import type { PostData } from "@/model/PostData";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/Loading";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  onSuccess: (newPost: PostData) => void;
  topicName: string;
}

export function CreatePostModal({
  isOpen,
  onClose,
  topicId,
  onSuccess,
  topicName,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
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
    formData.append("topicId", topicId);
    formData.append("title", title);
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = getJwtToken();
      const response = await fetch(
        "http://api.forum.didan.id.vn/forum/posts/new",
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
          title: "Post created successfully",
          description: "Your post has been published.",
        });
        onClose();
        setTitle("");
        setContent("");
        setFiles([]);
        if (data.data) {
          onSuccess(data.data);
        }
      } else {
        throw new Error(data.message || "Failed to create post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Hãy tạo nội dung cho bài viết có tiêu đề là "${title}" ở trong Topic "${topicName}"`;
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-2 pt-4">
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAIContent}
                disabled={isGenerating || !title}
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
              placeholder="Write your post content here..."
              className="min-h-[200px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="files">Attachments</Label>
            <div className="flex items-center gap-2">
              <Input
                id="files"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
              />
              <Label
                htmlFor="files"
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
          <div className="sticky bottom-0 mt-4 bg-background pb-4 pt-2">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Create Post
              </Button>
            </div>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
