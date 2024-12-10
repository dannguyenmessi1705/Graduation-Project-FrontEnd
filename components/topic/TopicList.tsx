import { TopicItem } from "./TopicItems";
import { ResponseStatus } from "@/model/ResponseStatus";
import { TopicData } from "@/model/TopicData";

type Topics = {
  status: ResponseStatus | null;
  data: TopicData[] | null;
};

async function fetchTopics(): Promise<Topics> {
  const response = await fetch(
    "http://api.forum.didan.id.vn/forum/posts/topic/all"
  );
  return await response.json();
}

export async function TopicsList() {
  const topics = await fetchTopics();

  return (
    <div className="space-y-4">
      <h2 className="mb-6 text-2xl font-bold">Đại sảnh</h2>
      {topics.data?.length === 0 || topics.data === null
        ? null
        : topics.data.map((topic) => <TopicItem key={topic.id} {...topic} />)}
    </div>
  );
}
