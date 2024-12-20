"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { useTopicContext } from "@/contexts/TopicContext";
import { motion } from "framer-motion";

interface TopicItemProps {
  id: string | null;
  name: string | null;
  totalPosts: number | null;
}

export function TopicItem({ id, name, totalPosts }: TopicItemProps) {
  const { setTopicName } = useTopicContext();

  const handleClick = () => {
    setTopicName(name);
  };

  return (
    <Link href={`/topics/${id}`} className="block" onClick={handleClick}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card className="p-4 shadow-md transition-colors duration-200 hover:bg-accent hover:shadow-lg">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <MessageSquare className="hidden size-6 text-primary md:block" />
            <div className="flex-1">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <h3 className="text-lg font-medium transition-colors duration-200 hover:text-primary">
                  {name}
                </h3>
                {name && <Badge variant="default">Topic</Badge>}
              </div>
              <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  {totalPosts}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="size-4" />
                  {totalPosts}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
