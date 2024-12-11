"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePostModal } from "./modal/CreatePostModal";
import { PenSquare } from "lucide-react";

interface CreatePostButtonProps {
  topicId: string;
}

export function CreatePostButton({ topicId }: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="gap-2">
        <PenSquare className="h-4 w-4" />
        Create Post
      </Button>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicId={topicId}
      />
    </>
  );
}
