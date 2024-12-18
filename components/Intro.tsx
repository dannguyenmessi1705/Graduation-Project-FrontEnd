"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [showIntro, setShowIntro] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => {
        router.push("/");
      }, 500); // Wait for fade out animation before redirecting
    }, 3000); // Show intro for 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  if (!showIntro) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="mb-4 text-6xl font-bold text-white">
          Welcome to Z&#39;Forum
        </h1>
        <p className="text-xl text-white">Your community awaits...</p>
      </motion.div>
    </motion.div>
  );
}
