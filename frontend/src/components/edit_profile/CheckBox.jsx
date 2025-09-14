import React from "react";

export default function Checkbox({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </div>
  );
}
