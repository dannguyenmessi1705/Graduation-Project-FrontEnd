"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TopicContextType {
  topicName: string;
  setTopicName: (name: string | null) => void;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export function TopicProvider({ children }: { children: ReactNode }) {
  const [topicName, setTopicName] = useState<string>("");

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <TopicContext.Provider value={{ topicName, setTopicName }}>
      {children}
    </TopicContext.Provider>
  );
}

export function useTopicContext() {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error("useTopicContext must be used within a TopicProvider");
  }
  return context;
}
