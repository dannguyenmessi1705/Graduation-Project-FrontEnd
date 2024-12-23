"use client";

import { TopicsList } from "@/components/topic/TopicList";
import { useEffect, useState, Suspense } from "react";
import { getTopics } from "@/lib/api";
import { TopicData as Topic } from "@/model/TopicData";
import { useSearchParams } from "next/navigation";
import Intro from "@/components/Intro";
import Head from "next/head";
import { motion } from "framer-motion";

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
    <>
      <Head>
        <title>Z&#39;Forum - Home</title>
      </Head>
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="mb-8 text-center text-4xl font-bold text-primary"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Forum Topics
        </motion.h1>
        <TopicsList
          topics={topics}
          currentPage={currentPage}
          totalPages={totalPage}
          baseUrl="/"
        />
      </motion.div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
