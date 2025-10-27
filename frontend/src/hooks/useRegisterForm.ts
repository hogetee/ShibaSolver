import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
}

type Initial = {
  username?: string;
  displayName?: string;
  bio?: string;
  education?: string;
  subjects?: Array<string | { name: string; color?: string }>;
  profilePic?: string | null;
};

type Props = {
  initial?: Initial;
};

// Example options (match styling of existing components)
const subjects = [
  { name: "Math", color: "blue" },
  { name: "Physics", color: "green" },
  { name: "Chemistry", color: "purple" },
  { name: "Biology", color: "red" },
  { name: "English", color: "orange" },
  { name: "History", color: "gray" },
];

const educationLevels = ["High School", "Undergraduate", "Graduate", "Other"];

export function useRegisterForm({ initial = {} }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: initial.username || "",
    displayName: initial.displayName || "",
    bio: initial.bio || "",
    education: initial.education || "",
    subjects: initial.subjects || ([] as any[]),
    agree: false,
    profilePic: initial.profilePic || (null as null | string),
  });

  const [errors, setErrors] = useState<{
    username: boolean;
    displayName: boolean;
    submit: string;
    agree?: boolean;
  }>({ username: false, displayName: false, submit: "", agree: false });
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "agree") {
      setErrors((prev) => ({ ...prev, agree: false, submit: "" }));
    }
    if (name === "username") {
      setUsernameStatus(value.trim() ? "checking" : "idle");
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        checkUsername(value.trim());
      }, 500);
    }
  };

  const checkUsername = async (username: string) => {
    if (!username) {
      setUsernameStatus("idle");
      return;
    }
    // Client-side pattern check to match backend validation
    const valid = /^[\w-]{3,20}$/.test(username);
    if (!valid) {
      setUsernameStatus("error");
      return;
    }
    try {
      const res = await fetch(
        `${apiBase()}/api/v1/users/${encodeURIComponent(username)}`
      );
      if (res.status === 404) setUsernameStatus("available");
      else if (res.ok) setUsernameStatus("taken");
      else setUsernameStatus("error");
    } catch {
      setUsernameStatus("error");
    }
  };

  const handleSubjectsChange = (selected: any[]) => {
    setFormData((prev) => ({ ...prev, subjects: selected }));
  };

  const handleProfilePicChange = (fileOrUrl: any) => {
    setFormData((prev) => ({ ...prev, profilePic: fileOrUrl }));
  };

  const handleEducationChange = (val: string) => {
    setFormData((prev) => ({ ...prev, education: val }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username:
        !formData.username.trim() ||
        usernameStatus === "taken" ||
        usernameStatus === "error" ||
        usernameStatus === "checking",
      displayName: !formData.displayName.trim(),
      submit: "",
      agree: !formData.agree,
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.displayName || newErrors.agree) return;

    const payload = {
      user_name: formData.username.trim(),
      display_name: formData.displayName.trim(),
      bio: formData.bio || null,
      education_level: formData.education || null,
      interested_subjects: (formData.subjects || []).map((s: any) =>
        typeof s === "string" ? s : s?.name
      ),
      profile_picture:
        typeof formData.profilePic === "string" ? formData.profilePic : null,
    };

    try {
      const res = await fetch(`${apiBase()}/api/v1/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ new_data: payload }),
      });
      const json = await res.json();

      if (!json.success) {
        const msg =
          (json?.error?.message as string) ||
          (json?.message as string) ||
          "Could not save profile";
        setErrors((prev) => ({ ...prev, submit: msg }));
        return;
      }

      const username = json.data?.user_name || payload.user_name;
      if (username) localStorage.setItem("username", username);
      router.push(`/user/${username}`);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: "Network error. Please try again.",
      }));
    }
  };

  return {
    formData,
    errors,
    usernameStatus,
    handleChange,
    handleSubjectsChange,
    handleProfilePicChange,
    handleEducationChange,
    handleSubmit,
  };
}
