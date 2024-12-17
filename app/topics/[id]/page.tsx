"use client";

import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/post/PostList";
import type { PostData } from "@/model/PostData";
import { useTopicContext } from "@/contexts/TopicContext";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { ResponseStatus } from "@/model/ResponseStatus";
import { CreatePostButton } from "@/components/CreatePostButton";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface TopicPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
  };
}

type Posts = {
  status: ResponseStatus | null;
  data: PostData[] | null;
};

async function getPosts(
  topicId: string,
  page: number = 0
): Promise<PostData[]> {
  const res = (await apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/topic/${topicId}?type=new&page=${page}`
  )) as Posts;
  return res.data ?? [];
}

export default function Page({ params, searchParams }: TopicPageProps) {
  const { topicName } = useTopicContext();
  const { isLoggedIn, handleExpiredToken } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const currentPage = Number(searchParams.page) || 0;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const threadsData = await getPosts(params.id, currentPage);
        setPosts(threadsData);
      } catch (error) {
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else {
          console.error("Failed to fetch threads:", error);
        }
      }
    };
    fetchPosts();
  }, [params.id, currentPage, handleExpiredToken]);

  return (
    <div className="space-y-6">
      <div className="border-b bg-white">
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <nav className="flex text-sm text-muted-foreground">
              <a href="/" className="hover:text-blue-600">
                Forums
              </a>
              <span className="mx-2">›</span>
              <span>{topicName || "Loading..."}</span>
            </nav>
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold">
                {topicName || "Loading..."}
              </h1>
              {isLoggedIn && <CreatePostButton topicId={params.id} />}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {posts.length === 0 || posts === null
            ? null
            : posts.map((post) => <PostList key={post.id} post={post} />)}
        </div>
        <div className="mt-6"></div>
        <Pagination
          currentPage={currentPage}
          totalPages={50} // Hardcoded for example, should come from API
          baseUrl={`/topics/${params.id}`}
        />
      </div>
    </div>
  );
}
