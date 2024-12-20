import { TopicItem } from "./TopicItems";
import { TopicData as Topic } from "@/model/TopicData";
import { Pagination } from "@/components/Pagination";
import { motion } from "framer-motion";

interface TopicsListProps {
  topics: Topic[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function TopicsList({
  topics,
  currentPage,
  totalPages,
  baseUrl,
}: TopicsListProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold">Đại sảnh</h2>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TopicItem key={topic.id} {...topic} />
          </motion.div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </motion.div>
  );
}
