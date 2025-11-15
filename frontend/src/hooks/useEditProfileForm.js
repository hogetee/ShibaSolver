"use client"
import { useEffect, useState, useRef } from "react";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
// import type { MappedUser } from "./useUserProfile"; // Uncomment and adjust if using TypeScript

// example Options for dropdowns with colors
const subjects = [
  { name: "Math", color: "blue" },
  { name: "Physics", color: "green" },
  { name: "Chemistry", color: "purple" },
  { name: "Biology", color: "red" },
  { name: "English", color: "orange" },
  { name: "History", color: "gray" }
];

const educationLevels = ["High School", "Undergraduate", "Graduate", "Other"];

export default function useEditProfileForm({ userData }) {
    const apiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';
    
      // Initialize form data with user data or default values
      const [formData, setFormData] = useState({
        username: userData?.username || "",
        displayName: userData?.displayName || "",
        bio: userData?.bio || "",
        education: userData?.educationLevel || "Undergraduate",
        subjects: userData?.topSubjects?.map(subject => {
          // Find matching subject with color from the subjects array
          const subjectObj = subjects.find(s => s.name.toLowerCase() === subject.toLowerCase());
          return subjectObj || { name: subject, color: "blue" };
        }) || [],
        agree: true,
        profilePic: userData?.avatarUrl || null,
      });
    
      const [errors, setErrors] = useState({ username: false, displayName: false, submit: '' });
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | available | taken | error
      const [isSubmitting, setIsSubmitting] = useState(false);
      const debounceRef = useRef(null);
      const originalUsername = userData?.username || "";
    
      // Update form data when userData changes
      useEffect(() => {
        if (userData) {
          setFormData({
            username: userData.username || "",
            displayName: userData.displayName || "",
            bio: userData.bio || "",
            education: userData.educationLevel || "Undergraduate",
            subjects: userData.topSubjects?.map(subject => {
              // Find matching subject with color from the subjects array
              const subjectObj = subjects.find(s => s.name.toLowerCase() === subject.toLowerCase());
              return subjectObj || { name: subject, color: "blue" };
            }) || [],
            agree: true,
            profilePic: userData.avatarUrl || null,
          });
        }
      }, [userData]);
    
      // Generic input change handler
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
    
        if (name === 'username') {
          const v = (value || '').trim();
          setUsernameStatus(v ? 'checking' : 'idle');
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            checkUsername(v);
          }, 500);
        }
      };
    
      const checkUsername = async (username) => {
        if (!username) { setUsernameStatus('idle'); return; }
        // If unchanged, allow
        if (originalUsername && username === originalUsername) { setUsernameStatus('available'); return; }
        const valid = /^[\w-]{3,20}$/.test(username);
        if (!valid) { setUsernameStatus('error'); return; }
        try {
          const res = await fetch(`${apiBase()}/api/v1/users/${encodeURIComponent(username)}`);
          if (res.status === 404) setUsernameStatus('available');
          else if (res.ok) setUsernameStatus('taken');
          else setUsernameStatus('error');
        } catch (e) {
          setUsernameStatus('error');
        }
      };
    
      // Subjects change
      const handleSubjectsChange = (selected) => {
        setFormData((prev) => ({ ...prev, subjects: selected }));
      };
    
      // Profile picture change
      const handleProfilePicChange = (file) => {
        setFormData((prev) => ({ ...prev, profilePic: file }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newErrors = {
          username: !formData.username.trim() || usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === 'error',
          displayName: !formData.displayName.trim(),
          submit: '',
        };
        setErrors(newErrors);
    
        if (newErrors.username || newErrors.displayName) {
          setIsSubmitting(false);
          return;
        }
    
        let profilePicUrl = null;
        try {
          if (formData.profilePic instanceof File) {
            profilePicUrl = await uploadImageToCloudinary(formData.profilePic);
          } else if (typeof formData.profilePic === "string") {
            profilePicUrl = formData.profilePic;
          }
        } catch (uploadErr) {
          console.error("Failed to upload profile image:", uploadErr);
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to upload profile picture. Please try again.",
          }));
          setIsSubmitting(false);
          return null;
        }

        const payload = {
          user_name: formData.username.trim(),
          display_name: formData.displayName.trim(),
          bio: formData.bio || null,
          education_level: formData.education || null,
          interested_subjects: (formData.subjects || []).map((s) =>
            typeof s === 'string' ? s : s?.name
          ),
          profile_picture: profilePicUrl,
        };

        return payload;
    }

    return {
      formData,
      setFormData,
      errors,
      setErrors,
      showDeleteModal,
      setShowDeleteModal,
      usernameStatus,
      isSubmitting,
      setIsSubmitting,
      handleChange,
      handleSubjectsChange,
      handleProfilePicChange,
      handleSubmit,
      educationLevels,
      subjects,
    };
}