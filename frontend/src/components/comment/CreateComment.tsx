// Cloudinary config
const CLOUD_NAME = "dvlsunwrx";
const UPLOAD_PRESET = "Shiba_comment_image";

import React, { useState } from "react";

import ProfilePic from "@/components/profile/profile_header/ProfilePic";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useCommentActions } from "./useCommentActions";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

// Uploads an image file to Cloudinary and returns the image URL
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

interface CreateCommentProps {
  placeholder?: string;
  author?: {
    profile_picture?: string;
    display_name?: string;
  };
  onSubmit?: (
    text: string,
    imageUrl?: string | null
  ) => Promise<boolean> | boolean | void;
  disabled?: boolean;
}

export default function CreateComment({
  placeholder = "Add a comment...",
  author,
  onSubmit,
  disabled = false,
}: CreateCommentProps) {
  const [comment, setComment] = useState("");
  const { user: currentUser } = useCurrentUser();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { attachedImagePreview, handleAttachImage, handleRemoveAttachment } =
    useCommentActions("create", 0, 0, false);
  const [localAttachedFile, setLocalAttachedFile] = useState<File | null>(null);

  {
    /*Auto-expand textarea handler*/
  }
  const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const submit = async (rawText?: string) => {
    const text = (rawText ?? comment).trim();
    if (!text && !localAttachedFile) {
      setComment("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      return;
    }
    // Convert localAttachedFile to Cloudinary URL if present
    let imageUrl: string | null = null;
    if (localAttachedFile) {
      imageUrl = await uploadImageToCloudinary(localAttachedFile);
    }
    // pass imageUrl and text to onSubmit
    let success = true;
    if (onSubmit) {
      const res = await onSubmit(text, imageUrl);
      success = typeof res === "boolean" ? res : true;
    }
    if (success) {
      setComment("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      // clear local attachment on success
      setLocalAttachedFile(null);
      handleRemoveAttachment();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-start rounded-full px-2 py-1 w-full">
        {/* Pfp */}
        <div className="w-10 h-10 mr-2 flex-shrink-0">
          <ProfilePic
            src={
              author?.profile_picture ??
              currentUser?.profile_picture ??
              "/image/DefaultAvatar.png"
            }
            alt={`${
              author?.display_name ?? currentUser?.display_name ?? "User"
            }'s avatar`}
            size={40}
          />
        </div>
        {/* Input */}
        <div className="mt-1 flex-1 rounded-2xl bg-accent-200 px-2 py-2 flex flex-col">
          <div className="flex items-start">
            <textarea
              className="ml-2 flex-1 outline-none text-dark-900 placeholder-dark-900/40 bg-transparent resize-none"
              placeholder={placeholder}
              value={comment}
              onChange={textareaChange}
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ maxHeight: "10rem", overflowY: "auto" }}
              disabled={disabled}
            />
            {/* Submit Button */}
            <button
              type="button"
              className={`ml-2 ${
                comment ? "text-dark-900 cursor-pointer" : "text-dark-900/40"
              }`}
              onClick={() => {
                void submit();
              }}
              aria-label="Submit comment"
              disabled={!comment || disabled}
            >
              <SendIcon />
            </button>
          </div>

          {/* Row below textarea: add button + preview */}
          <div className="mt-2 mb-1 flex items-start justify-start gap-4">
            {/* Add image button + hidden input */}
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

            {/* Preview */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
