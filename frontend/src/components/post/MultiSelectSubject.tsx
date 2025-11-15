import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectSubjectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  limit: number;
}

const MultiSelectSubject = ({ options, selected, onChange, limit }: MultiSelectSubjectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- ส่วนที่แก้ไข ---
  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      // ถ้าเลือกแล้ว ให้เอาออก
      onChange(selected.filter((item) => item !== option));
    } else if (selected.length < limit) {
      // ถ้ายังไม่เลือก และยังไม่เกิน limit ให้เพิ่มเข้าไป
      onChange([...selected, option]);
    }
    // ถ้าเกิน limit แล้ว จะไม่มีอะไรเกิดขึ้น (ไม่ต้องมี else)
  };
  // --------------------

  // Hook สำหรับปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="subject-multiselect" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
      
      {/* กล่องแสดงผล */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md border-gray-300 shadow-sm bg-white p-2 flex items-center cursor-pointer min-h-[38px]"
        data-testid="subject-select-box"
      >
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selected.map(item => (
              <span key={item} className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400"></span>
        )}
      </div>

      {/* Dropdown ตัวเลือก */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                selected.includes(option) ? 'bg-indigo-50 font-semibold' : ''
              }`}
              data-testid={`subject-option-${option}`}
            >
              <span className="block truncate">{option}</span>
              {selected.includes(option) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  ✓
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectSubject;