import { BackendUser } from "@/hooks/useUserProfile";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

type UserResponse = {
    success: boolean;
    data: BackendUser;
}
export interface UserData {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string;
  shibaMeter: number;
  topSubjects: string[];
  stats: {
    posts: number;
    comments: number;
  };
}


export const userService = {
    async getUserByUsername(username: string): Promise<UserResponse> {
        const response = await fetch(`${BASE_URL}/api/v1/users/${username}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }
        return response.json();
    },

    async getUserIdByUsername(username: string): Promise<number> {
        const response = await fetch(`${BASE_URL}/api/v1/users/${username}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user ID");
        }
        const data = await response.json();
        console.log("userService.getUserIdByUsername:", { username });
        console.log("Response data:", data.data.user_id);
        return data.data.user_id;
    },

    async getUserProfileByUsername(username: string): Promise<number> {
        const response = await fetch(`${BASE_URL}/api/v1/users/${username}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        console.log("data:", data);
        console.log("userService.getUserProfileByUsername:", { username });
        console.log("Response data:", data.data.profile_picture);
        return data.data.profile_picture;
    },

    async getUserPostsCount(userId: number): Promise<number> {
        const response = await fetch(`${BASE_URL}/api/v1/users/${userId}/posts`);
        if (!response.ok) {
            throw new Error("Failed to fetch user posts count");
        }
        const data = await response.json();
        return data.count;
    }

}
