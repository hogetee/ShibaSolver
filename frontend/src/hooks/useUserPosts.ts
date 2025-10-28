"use client";

import { useCallback, useEffect, useState } from "react";
import type { PostData } from "@/components/post/Post"; // type-only import
import { userService } from "@/utils/userService";
import { UserData } from "@/utils/userService";
import { set } from "mongoose";

type UseUserPostsResult = {
  posts: PostData[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  setPage: (page: number) => void;
  refetch: () => void;
};

export default function useUserPosts(
  username?: string | null
): UseUserPostsResult {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const BASE_URL = process.env.BACKEND_URL || "http://localhost:5003";
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    if (!username) {
      setUserId(null);
      return;
    }

    const fetchUserId = async () => {
      try {
        const id = await userService.getUserIdByUsername(username);
        setUserId(id.toString());
        console.log("Fetched user ID:", id);
      } catch (err) {
        setError("Failed to fetch user ID");
        setUserId(null);
      }
    };
    fetchUserId();
  }, [username]);

  const fetchUserData = useCallback(async () => {
    if (!username) return;

    try {
      const userResponse = await userService.getUserByUsername(username);
      
      setUserData(userResponse);

      return userResponse;
    } catch (err) {
      setError((err as Error).message || "Failed to fetch user data");
    }
    fetchUserData();
  }, [username, BASE_URL]);

  const fetchPosts = useCallback(
    async (pageNum: number, reset = false) => {
      if (!userId) return;
      setLoading(true);
      setError(null);

      try {
        const postsResponse = await fetch(
          `${BASE_URL}/api/v1/users/${userId}/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`
        );
        if (!postsResponse.ok) {
          throw new Error(`Error fetching posts: ${postsResponse.statusText}`);
        }

        const postsData = await postsResponse.json();
        console.log("Posts data fetched:", postsData);

        const postsArray = postsData.data as PostData[];

        const totalPostsCount = postsData.meta.total as number;
        const totalPagesCount = postsData.meta.totalPages as number;
        setTotalPosts(totalPostsCount);
        setTotalPages(totalPagesCount);

        const currentUserData = await fetchUserData();
        console.log("User data after fetching posts:", currentUserData?.data);
        console.log("User display name:", currentUserData?.data?.display_name);
        console.log("User profile picture:", currentUserData?.data?.profile_picture);

        const transformedPosts = postsArray.map((post) => ({
          ...post,
          // Ensure stats exist
          stats: post.stats || { likes: 0, dislikes: 0 },
          // Ensure author exists
          author: post.author || {
            display_name: currentUserData?.data?.display_name || "Unknown",
            profile_picture: currentUserData?.data?.profile_picture || "https://www.gravatar.com/avatar/?d=mp",
          },
          // Ensure boolean fields exist
          liked_by_user: Boolean(post.liked_by_user),
          disliked_by_user: Boolean(post.disliked_by_user),
        }));

        setPosts(transformedPosts);
        setCurrentPage(pageNum);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    },
    [userId, BASE_URL, fetchUserData]
  );

  const setPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      fetchPosts(pageNum);
    }
  }, [totalPages, currentPage, fetchPosts]);

  const refetch = useCallback(() => {
    setCurrentPage(1);
    setPosts([]);
    setTotalPages(0);
    setTotalPosts(0);
    setError(null);
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username, refetch]);

  return { posts, isLoading: loading, error, currentPage, totalPages, totalPosts, setPage, refetch };
}
