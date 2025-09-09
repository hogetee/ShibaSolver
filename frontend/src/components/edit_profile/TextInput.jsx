import React from "react";

export default function TextInput({ label, name, value, onChange, error, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded px-2 py-1 mt-1"
      />
      {error && <span className="text-red-500 text-sm">Invalid input</span>}
    </div>
  );
}
