import React, { useRef } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function ProfilePicture({ value, onChange }) {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col " >
      <label className="font-semibold cursor-pointer bg-accent-600/70 hover:bg-accent-600/60 text-white px-4 py-2 rounded-xl justify-center flex" onClick={() => inputRef.current.click()}> 
        <AddCircleOutlineIcon  fontSize="small" className="text-white mr-1" />
        Select profile picture
      </label>
      <div
        className="w-[100%] h-[100%] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer mt-1"
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
