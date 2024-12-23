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
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Loading } from "@/components/Loading";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const threadsData = await getPosts(params.id, currentPage);
        setPosts(threadsData);
      } catch (error) {
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        } else {
          console.error("Failed to fetch threads:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [params.id, currentPage, handleExpiredToken]);

  const handleNewPost = (newPost: PostData) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <motion.div
      className="container mx-auto p-4 dark:bg-gray-800 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <motion.nav
          className="flex text-sm text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="hover:text-blue-600">
            Forums
          </Link>
          <span className="mx-2">›</span>
          <span>{topicName || "Loading..."}</span>
        </motion.nav>
        <motion.div
          className="flex flex-col space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold">{topicName || "Loading..."}</h1>
          {isLoggedIn && (
            <CreatePostButton topicId={params.id} onSuccess={handleNewPost} />
          )}
        </motion.div>
      </div>

      <Separator className="my-6" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex h-64 items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loading size={40} color="primary" />
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                >
                  <PostList key={post.id} post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={50}
              baseUrl={`/topics/${params.id}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
