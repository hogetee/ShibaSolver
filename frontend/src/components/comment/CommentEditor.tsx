import type { CommentContent } from "./types";
import React, { useRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useCommentActions } from "./useCommentActions";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const CLOUD_NAME = "dvlsunwrx";
const UPLOAD_PRESET = "Shiba_comment_image";

async function uploadImageToCloudinary(file: File): Promise<string | null> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url || data.url || null;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
}

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
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { attachedImagePreview, handleAttachImage, handleRemoveAttachment } =
    useCommentActions("0", 0, 0, false);
  const [localAttachedFile, setLocalAttachedFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  console.log("[CommentEditor] Rendered with initialContent:", initialContent);

  useEffect(() => {
    setContent(initialContent);
    setImageUrl(initialContent.image || "");
    // If there's an existing image, show it in the preview
    if (initialContent.image) {
      setShowImageInput(false);
    }
  }, [initialContent]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = content.text;

    // if (imageRemoved) {
    //   const removedContent = {
    //     text: text.trim(),
    //     image: null,
    //   };

    //   onSave(removedContent);

    //   setContent(removedContent);
    //   setImageRemoved(false);
    //   setLocalAttachedFile(null);
    //   handleRemoveAttachment();
    //   if (fileInputRef.current) fileInputRef.current.value = "";

    //   return;
    // }

    if (!text && !localAttachedFile && !content.image) {
      return;
    }

    let finalImageUrl = content.image || "";

    // If there's a new file attached, upload it
    if (localAttachedFile) {
      const uploadedUrl = await uploadImageToCloudinary(localAttachedFile);
      finalImageUrl = uploadedUrl || "";
    }

    const savedContent = {
      text: text.trim(),
      image: finalImageUrl.trim() || null,
    };

    if(imageRemoved) {
      savedContent.image = null;
      setImageRemoved(false);
      console.log("Image was removed before submit.");
    }

    onSave(savedContent);

    setLocalAttachedFile(null);
    setContent(savedContent);
    handleRemoveAttachment();
    if (fileInputRef.current) fileInputRef.current.value = "";

    console.log("[CommentEditor] Submitted content:", savedContent);
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
      setContent((prev) => ({ ...prev, image: imageUrl.trim() }));
      setShowImageInput(false);
    }
  };

  const handleRemoveImage = () => {
    setContent((prev) => ({ ...prev, image: null }));
    setImageUrl("");
    setShowImageInput(false);
    setLocalAttachedFile(null);

    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";

    console.log("Remove Image: ", content);
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <textarea
        value={content.text}
        onChange={(e) =>
          setContent((prev) => ({ ...prev, text: e.target.value }))
        }
        onKeyDown={handleKeyDown}
        className="w-full p-2 border-2 border-transparent rounded-md focus:border-accent-400 outline-none transition duration-300 bg-accent-200 resize-none min-h-[100px]"
        rows={4}
        placeholder="Edit your comment..."
        autoFocus
      />

      <div className="mt-2 mb-1 flex items-start justify-start gap-4">
        <div>
          <button
            type="button"
            className="text-dark-900 cursor-pointer"
            onClick={() => {
              // clear previous value (onchange bug)
              if (fileInputRef.current) fileInputRef.current.value = "";
              fileInputRef.current?.click();
            }}
            aria-label="Attach image"
          >
            <AddPhotoAlternateIcon />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) {
              setLocalAttachedFile(f);
              await handleAttachImage(f);
            }
          }}
        />
      </div>

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
            <RemoveCircleIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {attachedImagePreview ? (
        <div className="relative w-20 h-20">
          <img
            src={attachedImagePreview}
            alt="attachment preview"
            className="object-cover w-20 h-20 rounded-md"
          />
          <button
            type="button"
            onClick={() => {
              setLocalAttachedFile(null);
              handleRemoveAttachment();
              // clear file input value
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5"
            aria-label="Remove attachment"
          >
            <RemoveCircleIcon className="h-5 w-5 text-red-600 cursor-pointer" />
          </button>
        </div>
      ) : null}

      <div className="flex justify-between items-center">
        <ThemeProvider theme={theme}>
          {/* Show image input button */}
          {/* {!showImageInput && !content.image && (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="pt-1 pb-1.5 px-1.5 rounded-full bg-transparent text-dark-900 hover:text-accent-400 hover:bg-accent-400/20 transition-colors duration-300 cursor-pointer"
            >
              <AddPhotoAlternateIcon />
            </button>
          )} */}
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
