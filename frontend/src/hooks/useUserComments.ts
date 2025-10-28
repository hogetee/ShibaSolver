"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "@/utils/userService";
import { profileCommentData } from "@/components/profile/profile_content/ProfileComment";
import { postService } from "@/utils/postService";
import { set } from "mongoose";

type UseUserCommentsResult = {
  comments: profileCommentData[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalComments: number;
  setPage: (page: number) => void;
  refetch: () => void;
};

export default function useUserComments(
  username?: string | null
): UseUserCommentsResult {
  const [comments, setComments] = useState<profileCommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const BASE_URL = process.env.BACKEND_URL || "http://localhost:5003";
  const COMMENTS_PER_PAGE = 10;

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

  const fetchComments = useCallback(
    async (pageNum: number, reset = false) => {
      if (!userId) return;
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        const commentResponse = await fetch(
          `${BASE_URL}/api/v1/comments/user/${userId}?limit=${COMMENTS_PER_PAGE}&page=${pageNum}&sort=latest`,
          {
            credentials: "include", // Use cookies instead of Authorization header
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (commentResponse.status === 401) {
          // Handle unauthorized - redirect to login or refresh token
          throw new Error("Unauthorized - please login");
        }
        if (!commentResponse.ok) {
          throw new Error(
            `Error fetching comments: ${commentResponse.statusText}`
          );
        }

        const commentsData = await commentResponse.json();
        const commentsArray = commentsData.data as profileCommentData[];
        console.log("Fetched comments data:", commentsData);
        const totalCommentsCount = commentsData.meta.total as number;
        const totalPagesCount = commentsData.meta.totalPages as number;
        setTotalComments(totalCommentsCount);
        setTotalPages(totalPagesCount);

        const currentUserData = await fetchUserData();

        console.log("User data after fetching posts:", currentUserData?.data);
        console.log("User display name:", currentUserData?.data?.display_name);
        console.log(
          "User profile picture:",
          currentUserData?.data?.profile_picture
        );

        const transformedComments = await Promise.all(
          commentsArray.map(async (comment) => {
            let postTitle = "Unknown Post";

            // Get post title if post_id exists
            if (comment.post_id) {
              try {
                postTitle = await postService.getPostTitleById(comment.post_id);
              } catch (error) {
                console.error(
                  `Failed to fetch post title for ${comment.post_id}:`,
                  error
                );
                postTitle = "Post Not Found";
              }
            }

            return {
              ...comment,
              post_id: comment.post_id, // Use the actual post_id from comment
              post_title: postTitle, // Use the fetched post title
              author: comment.author || {
                display_name: currentUserData?.data?.display_name || "Unknown",
                profile_picture:
                  currentUserData?.data?.profile_picture ||
                  "https://www.gravatar.com/avatar/?d=mp",
              },
            };
          })
        );

        setComments(transformedComments);
        setCurrentPage(pageNum);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    },
    [userId, BASE_URL, fetchUserData]
  );

  const setPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        fetchComments(page);
      }
    },
    [totalPages, currentPage, fetchComments]
  );

  const refetch = useCallback(() => {
    setCurrentPage(1);
    setComments([]);
    setTotalPages(0);
    setTotalComments(0);
    setError(null);
    fetchComments(1);
  }, [fetchComments]);

  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username, fetchComments]);

  return {
    comments,
    isLoading: loading,
    error,
    currentPage,
    totalPages,
    totalComments,
    setPage,
    refetch,
  };
}
