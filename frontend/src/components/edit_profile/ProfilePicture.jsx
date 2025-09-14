"use client";

import React, { useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function ProfilePicture({ value, onChange }) {
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  // Compute a stable preview URL only on the client after mount.
  useEffect(() => {
    let url = null;
    if (typeof window !== "undefined") {
      if (value instanceof File) {
        url = URL.createObjectURL(value);
        setPreviewUrl(url);
      } else if (typeof value === "string" && value) {
        setPreviewUrl(value);
      } else {
        setPreviewUrl(null);
      }
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [value]);

  return (
    <div className="flex flex-col justify-center items-center">
      <label className="font-semibold cursor-pointer bg-accent-600/70 hover:bg-accent-600/60 text-white px-4 py-2 rounded-xl justify-center flex" onClick={() => inputRef.current.click()}> 
        <AddCircleOutlineIcon  fontSize="small" className="text-white mr-1" />
        Select profile picture
      </label>
      <div
        className="mt-4 relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
        onClick={() => inputRef.current.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm flex text-center px-2">Click to upload</span>
        )}
        <input type="file" ref={inputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
}
