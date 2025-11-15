"use client";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { useState, useEffect } from "react";

type Props = {
  src?: string;
  alt?: string;
  size?: number | string; // px or CSS size (fallback if responsiveSize not provided)
  responsiveSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
};

export default function ProfilePic({ src, alt, size, responsiveSize }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <div
        style={{
          width: typeof size === 'string' ? size : (size ?? (responsiveSize?.xs ?? 160)),
          height: typeof size === 'string' ? size : (size ?? (responsiveSize?.xs ?? 160)),
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
      sx={{
        width: responsiveSize ? responsiveSize : (size ?? 160),
        height: responsiveSize ? responsiveSize : (size ?? 160)
      }}
    />
  );
}
