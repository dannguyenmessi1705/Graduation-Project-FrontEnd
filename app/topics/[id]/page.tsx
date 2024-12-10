"use client";

import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/post/PostList";
import type { PostData } from "@/model/PostData";
import { ResponseStatus } from "@/model/ResponseStatus";
import { useTopicContext } from "@/contexts/TopicContext";
import { useEffect, useState } from "react";
import { getposts } from "@/rest/postApi";

type Posts = {
  status: ResponseStatus | null;
  data: PostData[] | null;
};

interface TopicPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
  };
}

export default function Page({ params, searchParams }: TopicPageProps) {
  const { topicName } = useTopicContext();
  const [posts, setPosts] = useState<Posts>({ status: null, data: null });
  const currentPage = Number(searchParams.page) || 0;

  useEffect(() => {
    getposts(params.id, currentPage).then(setPosts);
  }, [params.id, currentPage]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{topicName || "Loading..."}</h1>
        <div className="text-sm text-muted-foreground">
          <nav className="flex gap-2">
            <a href="/" className="hover:text-blue-600">
              Forums
            </a>
            <span>›</span>
            <a href="/topics" className="hover:text-blue-600">
              Đại sảnh
            </a>
            <span>›</span>
            <span>{topicName || "Loading..."}</span>
          </nav>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {posts.data?.length === 0 || posts.data === null
          ? null
          : posts.data.map((post) => (
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
