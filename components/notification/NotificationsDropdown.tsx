"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/model/NotificationData";
import {
  getUnreadNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getCommentDetails,
} from "@/lib/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToNotifications,
} from "@/lib/websocket";
import { useRouter } from "next/navigation";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getUnreadNotifications(),
        getUnreadNotificationsCount(),
      ]);
      setNotifications(notifs.data);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Connect to WebSocket
    connectWebSocket();

    // Subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast({
        title: notification.title,
        description: notification.content,
      });
    });

    return () => {
      unsubscribe();
      disconnectWebSocket();
    };
  }, [toast]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId.toString());
      await fetchNotifications();
      toast({
        description: "Notification marked as read",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to mark notification as read",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await fetchNotifications();
      toast({
        description: "All notifications marked as read",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to mark all notifications as read",
      });
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId.toString());
      await fetchNotifications();
      toast({
        description: "Notification deleted",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete notification",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      await fetchNotifications();
      toast({
        description: "All notifications deleted",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete all notifications",
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.link) {
      try {
        if (notification.link.includes("/comments/")) {
          const commentId = notification.link.split("/").pop();
          const commentDetails = await getCommentDetails(commentId!);
          const postId = commentDetails.data.postId;
          router.push(`/posts/${postId}?highlightedCommentId=${commentId}`);
        } else {
          router.push(notification.link);
        }
        await handleMarkAsRead(notification.id);
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to fetch comment details:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch comment details",
          title: "Error",
        });
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="lunar-new-year:hover:bg-red-800 text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>
        <Separator className="mb-2" />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No new notifications
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="group relative flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-accent"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(
                          new Date(notification.createdAt).getTime() +
                            7 * 60 * 60 * 1000
                        )
                      )}{" "}
                      ago
                    </p>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      <span className="sr-only">Mark as read</span>
                      <span className="size-4">✓</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <span className="sr-only">Delete</span>
                      <span className="size-4">×</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
