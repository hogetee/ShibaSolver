"use client";

import { useState, useEffect, useMemo } from "react";
import { PostData } from "@/components/post/Post";

type RatingMap = Record<string, "like" | "dislike" | null>;
type StatsMap = Record<
  string,
  {
    likes: number;
    dislikes: number;
  }
>;

const FALLBACK_API_URL = process.env.NEXT_PUBLIC_API_URL  ;

export default function usePostRatings(posts: PostData[] | null) {
  const [postRatings, setPostRatings] = useState<RatingMap>({});
  const [postStats, setPostStats] = useState<StatsMap>({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const postIds = useMemo(() => {
    if (!posts) return [];
    return posts
      .map((post) => post.post_id)
      .filter((id): id is string => Boolean(id));
  }, [posts]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!posts || posts.length === 0 || postIds.length === 0) {
        setPostRatings({});
        setPostStats({});
        return;
      }

      setIsLoadingRatings(true);

      try {
        // console.log(
        //   "[usePostRatings] Fetching summaries for posts:",
        //   postIds.join(",")
        // );
        const response = await fetch(
          `${FALLBACK_API_URL}/api/v1/ratings/summary?target_type=post&ids=${postIds.join(",")}`,
          { credentials: "include" }
        );

        const ratings: RatingMap = {};
        const stats: StatsMap = {};

        if (response.ok) {
          const json = await response.json();
          // console.log("[usePostRatings] Raw summary response:", json);
          const summaries: Array<{
            id: number;
            likes: number;
            dislikes: number;
            my_rating: "like" | "dislike" | null;
          }> = json.data ?? [];

          const summaryMap = new Map<string, (typeof summaries)[number]>();
          summaries.forEach((summary) => {
            summaryMap.set(String(summary.id), summary);
          });

          posts.forEach((post) => {
            const summary = summaryMap.get(String(post.post_id));
            if (!summary) {
              // console.log(
              //   `[usePostRatings] No summary found for post ${post.post_id}, falling back to post.stats`,
              //   post.stats
              // );
            }
            ratings[post.post_id] = summary?.my_rating ?? null;
            stats[post.post_id] = {
              likes: Number(summary?.likes ?? post.stats?.likes ?? 0),
              dislikes: Number(summary?.dislikes ?? post.stats?.dislikes ?? 0),
            };
          });
        } else {
          console.warn("Failed to fetch rating summaries; using post defaults");
          posts.forEach((post) => {
            ratings[post.post_id] = null;
            stats[post.post_id] = {
              likes: post.stats?.likes ?? 0,
              dislikes: post.stats?.dislikes ?? 0,
            };
          });
        }

        setPostRatings(ratings);
        setPostStats(stats);
        // console.log("[usePostRatings] Parsed ratings:", ratings);
        // console.log("[usePostRatings] Parsed stats:", stats);
      } catch (err) {
        console.error("Failed to fetch post rating summaries:", err);
        const fallbackRatings: RatingMap = {};
        const fallbackStats: StatsMap = {};
        posts.forEach((post) => {
          fallbackRatings[post.post_id] = null;
          fallbackStats[post.post_id] = {
            likes: post.stats?.likes ?? 0,
            dislikes: post.stats?.dislikes ?? 0,
          };
        });
        setPostRatings(fallbackRatings);
        setPostStats(fallbackStats);
      } finally {
        setIsLoadingRatings(false);
      }
    };

    fetchRatings();
  }, [posts, postIds]);

  return { postRatings, postStats, isLoadingRatings };
}
