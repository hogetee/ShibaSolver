import React from "react";
import type { CommentContent } from "./types";

interface CommentContentProps {
  content: CommentContent;
}

export default function CommentContentDisplay({ content }: CommentContentProps) {
  return (
    <div className="mt-2 mb-4">
      <p className="text-gray-800">{content.text}</p>
      {/* {content.image && (
        <div className="mt-2">
          <img
            src={content.image}
            alt="Comment attachment"
            className="max-w-xs h-auto rounded-lg border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )} */}
    </div>
  );
}
