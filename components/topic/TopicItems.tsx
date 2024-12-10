"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { useTopicContext } from "@/contexts/TopicContext";

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
      <Card className="p-4 transition-colors hover:bg-accent">
        <div className="flex items-center gap-4">
          <MessageSquare className="size-6 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{name}</h3>
              {name && <Badge variant="default">Topic</Badge>}
            </div>
            <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
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
          {/*<div className="text-right">*/}
          {/*  <div className="flex items-center gap-2">*/}
          {/*    <Avatar className="size-8">*/}
          {/*      <AvatarImage src={lastPost.authorAvatar} />*/}
          {/*      <AvatarFallback>{lastPost.author[0]}</AvatarFallback>*/}
          {/*    </Avatar>*/}
          {/*    <div className="text-sm">*/}
          {/*      <p className="max-w-[200px] truncate text-muted-foreground">*/}
          {/*        {lastPost.title}*/}
          {/*      </p>*/}
          {/*      <p>{lastPost.timestamp}</p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </Card>
    </Link>
  );
}
