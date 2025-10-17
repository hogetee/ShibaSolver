import type { CommentContent } from "./types";
import { useState } from "react";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.text.trim()) {
      onSave({ text: content.text.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if(e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <textarea
        value={content.text}
        onChange={(e) => setContent({ text: e.target.value })}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border-2 border-accent-200/75 rounded-md focus:border-accent-400 outline-none transition duration-300"
        rows={4}
        placeholder="Edit your comment..."
        autoFocus
      />
      <div className="flex justify-end mt-2 gap-2">
        <ThemeProvider theme={theme}>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="error"
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
            size="large"
          >
            Save
          </Button>
        </ThemeProvider>
      </div>
    </form>
  );
}
