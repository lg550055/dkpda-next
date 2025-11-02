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
  const [currentVote, setCurrentVote] = useState<Vote>(userVote || null);

  const react = async (type: "upvote" | "downvote") => {
    const res = await api.post(`/articles/${articleId}/vote`, { vote_type: type });
    setUpvotes(res.data.upvotes);
    setDownvotes(res.data.downvotes);
    setCurrentVote(res.data.user_vote);
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={() => react("upvote")}
        className={`flex items-center gap-1 px-3 py-1 rounded ${
          currentVote === "upvote" ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        Up {upvotes}
      </button>
      <button
        onClick={() => react("downvote")}
        className={`flex items-center gap-1 px-3 py-1 rounded ${
          currentVote === "downvote" ? "bg-red-600 text-white" : "bg-gray-200"
        }`}
      >
        Down {downvotes}
      </button>
    </div>
  );
}