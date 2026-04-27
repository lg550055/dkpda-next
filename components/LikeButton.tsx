"use client";
import { useState } from "react";
import api from "@/lib/api";

type Vote = "upvote" | "downvote" | null;

export default function LikeButton({
  articleId,
  initialUpvotes,
  initialDownvotes,
  userVote,
}: {
  articleId: number;
  initialUpvotes: number;
  initialDownvotes: number;
  userVote?: Vote;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [currentVote, setCurrentVote] = useState<Vote>(userVote ?? null);

  const react = async (type: "upvote" | "downvote") => {
    try {
      const res = await api.post(`/articles/${articleId}/vote`, { vote_type: type });
      setUpvotes(res.data.upvotes);
      setDownvotes(res.data.downvotes);
      setCurrentVote(res.data.user_vote);
    } catch {
      // unauthenticated — silently ignore
    }
  };

  return (
    <div className="vote-btns">
      <button
        className={`vote-btn${currentVote === "upvote" ? " voted-up" : ""}`}
        onClick={() => react("upvote")}
        title="Upvote"
      >
        👍 {upvotes}
      </button>
      <button
        className={`vote-btn${currentVote === "downvote" ? " voted-down" : ""}`}
        onClick={() => react("downvote")}
        title="Downvote"
      >
        👎 {downvotes}
      </button>
    </div>
  );
}
