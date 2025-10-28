const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

export const postService = {
    async getPostTitleById(postId: string): Promise<string> {
        const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch post title");
        }
        const data = await response.json();
        return data.data.title;
    }
}