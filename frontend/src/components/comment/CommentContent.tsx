import React from "react";
import type { CommentContent } from "./types";

interface CommentContentProps {
  content: CommentContent;
}

export default function CommentContentDisplay({
  content,
}: CommentContentProps) {
  return (
    <div className="mt-2 mb-4 text-gray-800">
        {content.image && (
          <div className="m-1">
            <img
              src={content.image}
              alt="Comment attachment"
              className="max-w-xs h-auto rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        {content.text}
      </div>
  );
}
