import React from "react";

export default function TextInput({ label, name, value, onChange, error, placeholder ,required}) {
  return (
    <div className="flex flex-col mt-2" >
      <label className="font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-white  border rounded-xl px-3 py-3 mt-1 focus:outline-none ${
          error || (value?.trim?.() === '') ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'
        }`}
        aria-invalid={Boolean(error || (value?.trim?.() === ''))}
        // className="border rounded px-2 py-1 mt-1"
        // required = {required}
        // aria-required = {required}
      />
      {error && <span className="text-red-500 text-sm">Invalid input</span>}
    </div>
  );
}
