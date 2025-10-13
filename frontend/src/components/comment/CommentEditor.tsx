import type { CommentContent } from "./types";
import { useState } from "react";

interface CommentEditorProps {
  initialContent: CommentContent;
  onSave: (newContent: CommentContent) => void;
  onCancel: () => void;
}

export default function CommentEditor({
  initialContent,
  onSave,
  onCancel,
}: CommentEditorProps) {
  const [content, setContent] = useState<CommentContent>(initialContent);

  const handleSubmit = () => {
    onSave({ text: content.text });
  };

  return (
    <div className="mt-2">
      <textarea
        value={content.text}
        onChange={(e) => setContent({ text: e.target.value })}
        className="w-full p-2 border-2 border-accent-200/75 rounded-md focus:border-accent-400 outline-none transition duration-300"
        rows={4}
      />
      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md cursor-pointer transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-accent-200/75 hover:bg-accent-200 text-gray-700 rounded-md cursor-pointer transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  );
}
