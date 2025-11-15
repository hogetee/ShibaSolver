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

import useEditProfileForm from "@/hooks/useEditProfileForm";
import useEditProfileNavigation from "@/hooks/useEditProfileNavigation";

export default function ProfileForm({ userData, onProfileUpdate }) {
  const {
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
    handleSubmit: buildPayload,
    educationLevels,
    subjects,
  } = useEditProfileForm({ userData });
  const { updateProfile, handleDeleteSuccess } = useEditProfileNavigation({
    setErrors,
    setIsSubmitting,
    onProfileUpdate,
  });

  const handleSubmit = async (event) => {
    const payload = await buildPayload(event);
    if (payload) {
      await updateProfile(payload);
    }
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
              maxSelections={3}
            />
          </div>
        </div>


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
