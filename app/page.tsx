"use client";

import { TopicsList } from "@/components/topic/TopicList";
import { useEffect, useState, Suspense } from "react";
import { getTopics } from "@/lib/api";
import { TopicData as Topic } from "@/model/TopicData";
import { useSearchParams } from "next/navigation";
import Intro from "@/components/Intro";

function Page() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const totalPage = 50;
  const searchParams = useSearchParams();
  const currentPage = Math.max(0, Number(searchParams.get("page") || "0"));

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const fetchedTopics = await getTopics(currentPage);
        setTopics(fetchedTopics.data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };
    fetchTopics();
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return <Intro />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Forum Topics</h1>
      <TopicsList
        topics={topics}
        currentPage={currentPage}
        totalPages={totalPage}
        baseUrl="/"
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
