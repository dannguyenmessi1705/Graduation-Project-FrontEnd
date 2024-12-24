import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserDetails as User } from "@/model/UserData";

interface UserMentionSuggestionsProps {
  users: User[];
  onSelect: (user: User) => void;
  onClose: () => void;
}

export function UserMentionSuggestions({
  users,
  onSelect,
  onClose,
}: UserMentionSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % users.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(users[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [users, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (users.length === 0) return null;

  return (
    <div className="absolute z-10 w-64 rounded-md border border-input bg-background shadow-md">
      <ScrollArea className="h-48">
        <div ref={containerRef}>
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex cursor-pointer items-center p-2 ${
                index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
              }`}
              onClick={() => {
                onSelect(user);
                onClose();
              }}
            >
              <Avatar className="mr-2 size-6">
                <AvatarImage src={user.picture} alt={user.username} />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
