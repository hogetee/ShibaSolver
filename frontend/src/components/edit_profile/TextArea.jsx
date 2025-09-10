import React from "react";

export default function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded px-2 py-1 mt-1"
      />
    </div>
  );
}
