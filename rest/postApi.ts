import { ResponseStatus } from "@/model/ResponseStatus";
import type { PostData } from "@/model/PostData";

type Posts = {
  status: ResponseStatus | null;
  data: PostData[] | null;
};

export async function getposts(
  topicId: string,
  page: number = 0
): Promise<Posts> {
  const res = await fetch(
    `http://api.forum.didan.id.vn/forum/posts/topic/${topicId}?type=new&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function votePost(
  postId: string,
  voteType: "up" | "down",
  token: string | undefined
): Promise<void> {
  const res = await fetch(
    `http://api.forum.didan.id.vn/forum/posts/votes/add/${postId}?type=${voteType}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res);
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized: Please log in to vote");
    }
    throw new Error("Failed to vote post");
  }
}
