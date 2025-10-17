import type { CommentContent } from "./types";
import { useState } from "react";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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
    if (e.key === "Escape") {
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
        className="w-full p-2 border-2 border-transparent rounded-md focus:border-accent-400 outline-none transition duration-300 bg-accent-200"
        rows={4}
        placeholder="Edit your comment..."
        autoFocus
      />
      <div className="flex justify-between items-center">
        <ThemeProvider theme={theme}>
          <div className="pt-1 pb-1.5 px-1.5 rounded-full bg-transparent text-dark-900 hover:text-accent-400 hover:bg-accent-400/20 transition-colors duration-300 cursor-pointer">
            <AddPhotoAlternateIcon/>
          </div>
          <div className="flex justify-end mt-2 gap-2">
            <Button
              onClick={onCancel}
              variant="contained"
              color="error"
              size="large"
              disableElevation
              sx={{ flex: 1, maxWidth: "10ch" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="large"
              disableElevation
              sx={{ flex: 1, maxWidth: "10ch" }}
            >
              Save
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </form>
  );
}
