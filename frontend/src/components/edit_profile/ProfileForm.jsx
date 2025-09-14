import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Sub-components
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectDropdown from "./SelectDropdown";
import Checkbox from "./CheckBox";
import ProfilePicture from "./ProfilePicture";
import BackButton from "./BackButton";
import DeleteAccountModal from "./DeleteAccountModal";

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

export default function ProfileForm({ userData, onProfileUpdate }) {
  const router = useRouter();
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

    const payload = {
      user_name: formData.username.trim(),
      display_name: formData.displayName.trim(),
      bio: formData.bio || null,
      education_level: formData.education || null,
      interested_subjects: (formData.subjects || []).map((s) =>
        typeof s === 'string' ? s : s?.name
      ),
      profile_picture: typeof formData.profilePic === 'string' ? formData.profilePic : null,
    };

    try {
      const res = await fetch(`${apiBase()}/api/v1/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_data: payload }),
      });
      const json = await res.json();

      if (!json.success) {
        const msg = (json?.error?.message) || (json?.message) || 'Could not save profile';
        setErrors((prev) => ({ ...prev, submit: msg }));
        setIsSubmitting(false);
        return;
      }

      // Update localStorage with new username if it changed
      const username = json.data?.user_name || payload.user_name;
      if (username) localStorage.setItem('username', username);
      
      // Refresh the current user data
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      
      // Redirect to the user's profile page
      router.push(`/user/${username}`);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: 'Network error. Please try again.' }));
      setIsSubmitting(false);
    }
  };

  // Handle successful account deletion
  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    // Redirect to home page or login page
    router.push('/');
  };

  return (
    <div className=" p-5 rounded-2xl w-[65%] h-full flex flex-col gap-6 font-display">
      <div className = "text-center text-6xl font-medium text-dark-900">
          Edit your profile
      </div>
      <form
        onSubmit={handleSubmit}
          className="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex flex-col gap-5"
      >
      

      <TextInput
        label={<>
          Username
          <span className="ml-2 text-sm font-normal text-gray-600">3–20 chars: letters, numbers, _ or -</span>
        </>}
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="username"
        required
      />
      {formData.username && (
        <div className="text-sm mt-1">
          {usernameStatus === 'checking' && <span className="text-gray-500">Checking availability…</span>}
          {usernameStatus === 'available' && <span className="text-green-600">Username is available</span>}
          {usernameStatus === 'taken' && <span className="text-red-600">Username is already taken</span>}
          {usernameStatus === 'error' && <span className="text-red-600">Use 3–20 letters, numbers, _ or -</span>}
        </div>
      )}

      <TextInput
        label="Display Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        error={errors.displayName}
        placeholder="display name"
        required
      />

      <TextArea
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Write something about yourself"
      />

      <div className="flex gap-6">
        {/* Left side - Education and Subjects */}
        <div className="flex flex-col gap-5 w-2/3">
          <div className="flex flex-col">
            <label className="font-semibold text-dark-900">Education level</label>
            <SelectDropdown
              options={educationLevels}
              value={formData.education}
              onChange={(val) => setFormData((prev) => ({ ...prev, education: val }))}
              placeholder="Select your education level"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-dark-900">Interested Subject(s)</label>
            <SelectDropdown
              options={subjects}
              value={formData.subjects}
              onChange={handleSubjectsChange}
              placeholder="Select your subjects"
              multiple
            />
          </div>
        </div>

        {/* Right side - Profile Picture */}
        <div className="w-1/3 flex justify-center h-6rem mt-5">
          <ProfilePicture value={formData.profilePic} onChange={handleProfilePicChange} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600/70 text-white px-4 py-2 rounded hover:bg-red-600/60 transition-colors duration-200 cursor-pointer" 
          >
            Delete Account
          </button>
          <button
            type="submit"
            disabled={usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === 'error' || isSubmitting}
            className={`bg-accent-600 text-white px-4 py-2 rounded cursor-pointer ${
              usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === 'error' || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-600/80'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
      </div>
      
      {errors.submit && <div className="text-red-600 text-sm mt-2">{errors.submit}</div>}
    </form>
    
    <BackButton />
    {/* Delete Account Modal */}
    <DeleteAccountModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onSuccess={handleDeleteSuccess}
    />
    </div>
    
  );
}
