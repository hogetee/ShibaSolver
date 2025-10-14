import type { CommentContent } from "./types";

export default function CommentContent({ content } : { content: CommentContent }) {
    return (
        <p className="text-gray-600 my-1 text-base">{content.text}</p>
    );
}