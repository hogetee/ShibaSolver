"use client";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { useState, useEffect } from "react";

type Props = {
  src?: string;
  alt?: string;
  size?: number; // px
};

export default function ProfilePic({ src, alt, size }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <div
        style={{
          width: size ?? 160,
          height: size ?? 160,
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  return (
    <Avatar
      alt={alt}
      src={src}
      sx={{ width: size ?? 160, height: size ?? 160 }}
    />
  );
}
