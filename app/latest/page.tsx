"use client";

import { useState, useEffect } from "react";
import { PostList } from "@/components/post/PostList";
import { Pagination } from "@/components/Pagination";
import { apiRequest } from "@/lib/api";
import { Loading } from "@/components/Loading";
import { PostDetailData as Post } from "@/model/PostDetailData";
import { motion } from "framer-motion";

async function getLatestPosts(page: number = 0): Promise<{ data: Post[] }> {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/?searchType=new&page=${page}`
  );
}
interface LatestPageProps {
  searchParams: {
    page?: string;
  };
}

export default function Home({ searchParams }: LatestPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const currentPage = Number(searchParams.page) || 0;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await getLatestPosts(currentPage);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch latest posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  if (!posts)
    return (
      <motion.div
        className="flex h-64 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Loading size={40} color="primary" />
      </motion.div>
    );
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size={40} color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Latest Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostList key={post.id} post={post} />
        ))}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={50}
          baseUrl={`/latest`}
        />
      </div>
    </div>
  );
}
