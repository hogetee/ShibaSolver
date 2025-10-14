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
        <ThemeProvider theme={theme}>
          <Button
            onClick={handleSubmit}
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
    </div>
  );
}
