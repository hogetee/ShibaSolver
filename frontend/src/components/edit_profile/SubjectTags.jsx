import React from "react";
import { colorClasses } from "./colorConfig";

export default function SubjectTags({ subjects }) {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  // Function to get color for a subject (supports both string and object formats)
  const getSubjectColor = (subject) => {
    // If subject is an object with color property
    if (typeof subject === 'object' && subject.color) {
      return colorClasses[subject.color] || colorClasses.blue;
    }
    // If subject is an object with default color
    if (typeof subject === 'object' && !subject.color) {
      return colorClasses.blue;
    }
    // If subject is just a string, use default blue
    return colorClasses.blue;
  };

  // Function to get subject name (handles both string and object formats)
  const getSubjectName = (subject) => {
    if (typeof subject === 'object') {
      return subject.name || subject.subject || subject.label || 'Unknown';
    }
    return subject;
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {subjects.map((subject, index) => {
        const subjectColor = getSubjectColor(subject);
        const subjectName = getSubjectName(subject);
        
        return (
          <div
            key={index}
            className={`${subjectColor.bg} ${subjectColor.text} px-3 py-1 rounded-full text-sm`}
          >
            <span>{subjectName}</span>
          </div>
        );
      })}
    </div>
  );
}
