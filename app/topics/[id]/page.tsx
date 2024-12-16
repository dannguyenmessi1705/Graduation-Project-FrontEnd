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
  return res.data || [];
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
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{topicName || "Loading..."}</h1>
        {isLoggedIn && <CreatePostButton topicId={params.id} />}
        <div className="text-sm text-muted-foreground">
          <nav className="flex gap-2">
            <a href="/" className="hover:text-blue-600">
              Forums
            </a>
            <span>›</span>
            <span>{topicName || "Loading..."}</span>
          </nav>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {posts.length === 0 || posts === null
          ? null
          : posts.map((post) => (
              <PostList
                key={post.id}
                post={post}
                views={Math.floor(Math.random() * 1000)} // Simulated view count
              />
            ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={50} // Hardcoded for example, should come from API
        baseUrl={`/topics/${params.id}`}
      />
    </div>
  );
}
