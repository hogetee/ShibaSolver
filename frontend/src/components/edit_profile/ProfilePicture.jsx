import React, { useRef } from "react";

export default function ProfilePicture({ value, onChange }) {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col">
      <label className="font-semibold">Profile Picture</label>
      <div
        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer mt-1"
        onClick={() => inputRef.current.click()}
      >
        {value ? (
          <img src={URL.createObjectURL(value)} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm">Click to upload</span>
        )}
        <input type="file" ref={inputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
}
