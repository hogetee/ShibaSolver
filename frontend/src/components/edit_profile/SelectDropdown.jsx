import React, { useState, useRef, useEffect } from "react";
import SubjectTags from "./SubjectTags";
import CompactSubjectTags from "./CompactSubjectTags";

export default function SelectDropdown({ options, value, onChange, placeholder, multiple, color }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside our dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    if (multiple) {
      // For multiple selection: toggle the option in/out of selection
      const currentValues = Array.isArray(value) ? value : [];
      
      // Check if option is already selected (handle both string and object formats)
      const isAlreadySelected = currentValues.some(v => {
        const optionName = typeof option === 'object' ? (option.name || option.subject || option.label) : option;
        const valueName = typeof v === 'object' ? (v.name || v.subject || v.label) : v;
        return optionName === valueName;
      });
      
      const newValues = isAlreadySelected
        ? currentValues.filter(v => {
            const optionName = typeof option === 'object' ? (option.name || option.subject || option.label) : option;
            const valueName = typeof v === 'object' ? (v.name || v.subject || v.label) : v;
            return optionName !== valueName;
          })
        : [...currentValues, option];
      onChange(newValues);
    } else {
      // For single selection: select the option and close dropdown
      onChange(option);
      setIsOpen(false);
    }
  };

  const isSelected = (option) => {
    if (multiple) {
      return Array.isArray(value) && value.some(v => {
        // Handle both string and object formats
        const optionName = typeof option === 'object' ? (option.name || option.subject || option.label) : option;
        const valueName = typeof v === 'object' ? (v.name || v.subject || v.label) : v;
        return optionName === valueName;
      });
    }
    return value === option;
  };

  const displayValue = () => {
    if (multiple) {
      if (Array.isArray(value) && value.length > 0) {
        return `${value.length} subject(s) selected`;
      }
      return placeholder; 
    }

    // For single selection or no selection, show value or placeholder
    return value || placeholder;
  };

  const handleRemoveSubject = (subjectToRemove) => {
    const newValues = value.filter(v => {
      // Handle both string and object formats
      const subjectName = typeof subjectToRemove === 'object' ? (subjectToRemove.name || subjectToRemove.subject || subjectToRemove.label) : subjectToRemove;
      const valueName = typeof v === 'object' ? (v.name || v.subject || v.label) : v;
      return subjectName !== valueName;
    });
    onChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3 py-3 mt-1 focus:outline-none text-left ${
          'border-gray-300 focus:ring-1 focus:ring-blue-500'
        } ${multiple && Array.isArray(value) && value.length > 0 ? 'flex flex-col items-start gap-2' : 'flex justify-between items-center'}`}
      >
        {multiple && Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-col gap-2 w-full justify-between">
            <div className="flex justify-between items-center">
            <CompactSubjectTags subjects={value} onRemove={handleRemoveSubject} />
              <svg
                className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div> 
          </div>
        ) : (
          <>
            <span className={!value || (multiple && (!Array.isArray(value) || value.length === 0)) ? 'text-gray-500' : ''}>
              {displayValue()}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </div>


      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const optionName = typeof option === 'object' ? (option.name || option.subject || option.label) : option;
            const optionKey = typeof option === 'object' ? (option.id || option.key || index) : option;
            
            return (
              <div
                key={optionKey}
                onClick={() => handleOptionClick(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${
                  isSelected(option) ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                }`}
              >
                <span>{optionName}</span>
                {isSelected(option) && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
