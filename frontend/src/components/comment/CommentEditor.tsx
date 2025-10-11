import type { CommentContent } from "./types";
import { useState } from "react";

interface CommentEditorProps {
    initialContent: CommentContent;
    onSave: (newContent: CommentContent) => void;
    onCancel: () => void;
}


export default function CommentEditor(
    { initialContent, onSave, onCancel }: CommentEditorProps
){
    const [content, setContent] = useState<CommentContent>(initialContent);

    const handleSubmit = () => {
        onSave({text : content.text});
    }

 return (
    <div className="mt-2">
        <textarea
        value={content.text}
        onChange={(e) => setContent({ text: e.target.value })}
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-purple-500 outline-none"
        rows={4}
        />
        <div className="flex justify-end mt-2 gap-2">
        <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
            Cancel
        </button>
        <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
            Save
        </button>
        </div>
    </div>
 );
}