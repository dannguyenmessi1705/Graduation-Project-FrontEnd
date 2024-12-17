"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { PostData } from "@/model/PostData";
import { getUserDetails } from "@/lib/api";

interface postListItemProps {
  post: PostData;
}

export function PostList({ post }: postListItemProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fecthUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(post.author.id);
        setAvatarUrl(userDetails.data.picture);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fecthUserDetails();
  }, [post.author.id]);

  return (
    <Link href={`/posts/${post.id}`} className="block">
      <Card className="p-4">
        <div className="flex gap-4">
          <Avatar className="size-10">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {post.author.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 hover:bg-orange-100"
              >
                bài viết
              </Badge>
              <Link
                href={`/posts/${post.id}`}
                className="truncate font-medium hover:text-blue-600"
              >
                {post.title}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/user/${post.author.username}`}
                className="hover:text-blue-600"
              >
                {post.author.username}
              </Link>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </div>
          <div className="flex min-w-[100px] flex-col items-end gap-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="size-4" />
                {post.totalComments}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="size-4" />
                {post.totalUpvotes}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown className="size-4" />
                {post.totalDownvotes}
              </div>
              {/*<div className="flex items-center gap-1">*/}
              {/*  <Eye className="size-4" />*/}
              {/*  {views}*/}
              {/*</div>*/}
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {post.author.username}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
