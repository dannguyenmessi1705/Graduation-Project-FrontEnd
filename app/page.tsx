import { TopicsList } from "@/components/topic/TopicList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8">
        <TopicsList />
      </main>
    </div>
  );
}
