"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePostModal } from "./modal/CreatePostModal";
import { PlusCircle } from "lucide-react";
import type { PostData } from "@/model/PostData";

interface CreatePostButtonProps {
  topicId: string;
  onSuccess: (newPost: PostData) => void;
}

export function CreatePostButton({
  topicId,
  onSuccess,
}: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="gap-2" size="lg">
        <PlusCircle className="size-5" />
        Create New Post
      </Button>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicId={topicId}
        onSuccess={onSuccess}
      />
    </>
  );
}
