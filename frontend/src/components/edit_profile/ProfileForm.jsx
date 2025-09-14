import React, { useState } from "react";
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

export default function ProfileForm() {
  const router = useRouter();

  // dummy values (old data)
  const [formData, setFormData] = useState({
    username: "johndoe",
    displayName: "John Doe",
    bio: "Avid learner and problem solver.",
    education: "Undergraduate",
    subjects: [
      { name: "Math", color: "blue" },
      { name: "Physics", color: "green" }
    ],
    agree: true,
    profilePic: null,
  });

  const [errors, setErrors] = useState({ username: false, displayName: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Generic input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Subjects change
  const handleSubjectsChange = (selected) => {
    setFormData((prev) => ({ ...prev, subjects: selected }));
  };

  // Profile picture change
  const handleProfilePicChange = (file) => {
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };
  // ******************************************** 
  // Submit handler CHANGE WHEN BACKEND IS READY
  // ******************************************** 
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      username: !formData.username.trim(),
      displayName: !formData.displayName.trim(),
    };
    setErrors(newErrors);

    if (!newErrors.username && !newErrors.displayName && formData.agree) {
      console.log("Form submitted", formData);
      alert("Profile updated!");
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
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="username"
        required
      />

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
            className="bg-red-600/70 text-white px-4 py-2 rounded hover:bg-red-600/60 transition-colors duration-200"
          >
            Delete Account
          </button>
          <button
            type="submit"
            className="bg-accent-600 hover:bg-accent-600/80 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
      </div>
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
