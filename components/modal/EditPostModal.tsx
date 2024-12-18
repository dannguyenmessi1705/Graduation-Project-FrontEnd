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
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { updatePost } from "@/lib/api";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialTitle: string;
  initialContent: string;
  initialFiles: string[];
  onSuccess: () => void;
}

export function EditPostModal({
  isOpen,
  onClose,
  postId,
  initialTitle,
  initialContent,
  initialFiles,
  onSuccess,
}: EditPostModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>(initialFiles);
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

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("files", file);
    });
    existingFiles.forEach((file) => {
      formData.append("existingFiles", file);
    });

    try {
      await updatePost(postId, formData);
      toast({
        title: "Post updated successfully",
        description: "Your post has been updated.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="content">Content</Label>
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
                className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent"
              >
                <Upload className="size-4" />
                Add Files
              </Label>
              <span className="text-sm text-muted-foreground">
                {files.length + existingFiles.length} file(s) selected
              </span>
            </div>
            {existingFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {existingFiles.map((file, index) => (
                  <div key={index} className="group relative">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <Image
                        src={decodeURIComponent(file)}
                        alt={`Existing Attachment ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingFile(index)}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Update Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
