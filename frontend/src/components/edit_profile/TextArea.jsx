import React from "react";

export default function TextArea({ label, name, value, onChange, placeholder, maxLength = 300 }) {
  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <label className="font-semibold">{label}</label>
        <span className="text-sm text-gray-500">
          {value?.length || 0}/{maxLength}
        </span>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`bg-white border rounded-xl px-3 py-3 mt-1 focus:outline-none resize-none min-h-[80px] max-h-[200px] ${
         'border-gray-300 focus:ring-1 focus:ring-blue-500'
        }`}
        rows={3}
        style={{
          height: 'auto',
          overflow: 'hidden'
        }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
        }}
      />
      {value?.length >= maxLength * 0.9 && (
        <span className="text-xs text-orange-500 mt-1">
          {maxLength - (value?.length || 0)} characters remaining
        </span>
      )}
    </div>
  );
}
