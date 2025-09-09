import React, { useState } from "react";

// Sub-components
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectDropdown from "./SelectDropdown";
// import Checkbox from "./Checkbox";
import ProfilePicture from "./ProfilePicture";

// Options for dropdowns
const subjects = ["Math", "Physics", "Chemistry", "Biology"];
const educationLevels = ["High School", "Undergraduate", "Graduate", "Other"];

export default function ProfileForm() {
  // Initial values (old data)
  const [formData, setFormData] = useState({
    username: "johndoe",
    displayName: "John Doe",
    bio: "Avid learner and problem solver.",
    education: "Undergraduate",
    subjects: ["Math", "Physics"],
    agree: true,
    profilePic: null,
  });

  const [errors, setErrors] = useState({ username: false, displayName: false });

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

  // Submit handler
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-purple-100 p-6 rounded-xl max-w-lg mx-auto flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Edit Your Profile</h1>

      <TextInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="username"
      />

      <TextInput
        label="Display Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        error={errors.displayName}
        placeholder="display name"
      />

      <TextArea
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Write something about yourself"
      />

      <div className="flex flex-col">
        <label className="font-semibold">Education level</label>
        <SelectDropdown
          options={educationLevels}
          value={formData.education}
          onChange={(val) => setFormData((prev) => ({ ...prev, education: val }))}
          placeholder="Select your education level"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">Interested Subject(s)</label>
        <SelectDropdown
          options={subjects}
          value={formData.subjects}
          onChange={handleSubjectsChange}
          placeholder="Select your subjects"
          multiple
        />
      </div>

      <ProfilePicture value={formData.profilePic} onChange={handleProfilePicChange} />

      <Checkbox
        name="agree"
        checked={formData.agree}
        onChange={handleChange}
        label={
          <>
            Agree to <a href="#" className="text-blue-600 underline">Terms & Agreement</a>
          </>
        }
      />

      <button
        type="submit"
        className="bg-purple-800 text-white px-4 py-2 rounded self-end"
      >
        Save Profile
      </button>
    </form>
  );
}
