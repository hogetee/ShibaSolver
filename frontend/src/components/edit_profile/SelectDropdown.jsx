import React from "react";

export default function SelectDropdown({ options, value, onChange, placeholder, multiple }) {
  return (
    <select
      value={value}
      onChange={(e) => {
        if (multiple) {
          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
          onChange(selected);
        } else {
          onChange(e.target.value);
        }
      }}
      multiple={multiple}
      className="border rounded px-2 py-1 mt-1"
    >
      {!multiple && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
