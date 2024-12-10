export async function voteComment(
  commentId: string,
  voteType: "up" | "down",
  token: string | undefined
): Promise<void> {
  const res = await fetch(
    `http://api.forum.didan.id.vn/forum/comments/votes/add/${commentId}?type=${voteType}`,
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
    throw new Error("Failed to vote");
  }
}