import { TopicItem } from "./TopicItems";
import { TopicData as Topic } from "@/model/TopicData";
import { Pagination } from "@/components/Pagination";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Đại sảnh</h2>
      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicItem key={topic.id} {...topic} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </div>
  );
}
