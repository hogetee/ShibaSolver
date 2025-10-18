import type { CommentContent } from "./types";
import { useRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

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
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState(content.image || "");

  console.log("[CommentEditor] Rendered with initialContent:", initialContent);

 useEffect(() => {
    setContent(initialContent);
    setImageUrl(initialContent.image || "");
  }, [initialContent]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.text.trim() || imageUrl.trim()) {
      onSave({ 
        text: content.text.trim(),
        image: imageUrl.trim() || null
      });
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

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setContent(prev => ({ ...prev, image: imageUrl.trim() }));
      setShowImageInput(false);
    }
  };

  const handleRemoveImage = () => {
    setContent(prev => ({ ...prev, image: null }));
    setImageUrl("");
    setShowImageInput(false);
  };


  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <textarea
        value={content.text}
        onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border-2 border-transparent rounded-md focus:border-accent-400 outline-none transition duration-300 bg-accent-200 resize-none min-h-[100px]"
        rows={4}
        placeholder="Edit your comment..."
        autoFocus
      />

      {/* Image URL Input */}
      {showImageInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 p-2 border rounded-md focus:border-accent-400 outline-none"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Preview */}
      {content.image && (
        <div className="mt-2 relative inline-block">
          <img
            src={content.image}
            alt="Preview"
            className="max-w-xs h-auto rounded-lg border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <ThemeProvider theme={theme}>
          {/* Show image input button */}
          {!showImageInput && !content.image && (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="pt-1 pb-1.5 px-1.5 rounded-full bg-transparent text-dark-900 hover:text-accent-400 hover:bg-accent-400/20 transition-colors duration-300 cursor-pointer"
            >
              <AddPhotoAlternateIcon />
            </button>
          )}
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
