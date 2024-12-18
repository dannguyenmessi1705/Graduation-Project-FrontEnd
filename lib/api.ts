import { getJwtToken } from "./auth";
import { NotificationResponse } from "@/model/NotificationData";
import { UserDetails } from "@/model/UserData";
import { TopicData } from "@/model/TopicData";

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  auth: boolean = false
) {
  const token = auth ? getJwtToken() : null;
  const headers = {
    ...(!(options.body instanceof FormData) && { Accept: "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("TokenExpiredError");
  }

  if (!response.ok) {
    throw new Error("ApiError");
  }

  return response.json();
}

export async function getUnreadNotifications(
  page: number = 0
): Promise<NotificationResponse> {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/notifications/unread?page=${page}`,
    {
      method: "GET",
    },
    true
  );
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const response = await apiRequest(
    "http://api.forum.didan.id.vn/forum/notifications/unread/count",
    {
      method: "GET",
    },
    true
  );
  return response.count;
}

export async function getAllNotifications(
  page: number = 0
): Promise<NotificationResponse> {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/notifications/all?page=${page}`,
    {
      method: "GET",
    },
    true
  );
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/notifications/mark/read/${notificationId}`,
    {
      method: "PUT",
    },
    true
  );
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiRequest(
    "http://api.forum.didan.id.vn/forum/notifications/mark/read/all",
    {
      method: "PUT",
    },
    true
  );
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/notifications/delete/${notificationId}`,
    {
      method: "DELETE",
    },
    true
  );
}

export async function deleteAllNotifications(): Promise<void> {
  await apiRequest(
    "http://api.forum.didan.id.vn/forum/notifications/delete/all",
    {
      method: "DELETE",
    },
    true
  );
}

export async function getCommentDetails(commentId: string) {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/comments/get/${commentId}`
  );
}

export async function getUserDetails(
  userId: string
): Promise<{ data: UserDetails }> {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/users/detail/${userId}`
  );
}

export async function getTopics(
  page: number = 0
): Promise<{ data: TopicData[] }> {
  return apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/topic/all?page=${page}`
  );
}

export async function updateUserProfile(
  formData: FormData
): Promise<{ data: UserDetails }> {
  return apiRequest(
    "http://api.forum.didan.id.vn/forum/users/update",
    {
      method: "PUT",
      body: formData,
    },
    true
  );
}

export async function revokeVote(
  type: "post" | "comment",
  id: string
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/${type}s/votes/revoke/${id}`,
    {
      method: "DELETE",
    },
    true
  );
}

export async function updatePost(
  postId: string,
  formData: FormData
): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/update/${postId}`,
    {
      method: "PUT",
      body: formData,
    },
    true
  );
}

export async function deletePost(postId: string): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/posts/delete/${postId}`,
    {
      method: "DELETE",
    },
    true
  );
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiRequest(
    `http://api.forum.didan.id.vn/forum/comments/delete/${commentId}`,
    {
      method: "DELETE",
    },
    true
  );
}
