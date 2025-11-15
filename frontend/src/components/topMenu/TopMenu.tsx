"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeOutlined, Home,
  SettingsOutlined, Settings,
  NotificationsNone, Notifications,
} from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function TopMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { isOpen, toggle, open } = useNotification();

  const { user, isLoading, refetch } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const handleLogout = () => refetch();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [refetch]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleBellClick = () => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => open(), 180);
      return;
    }
    toggle();
  };
  if (isLoading) return null;

  return (
   <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">

  {/* Logo */}
  <Link href="/">
  <span className="font-sans font-black text-3xl text-white px-4">
    Shiba
  </span>
</Link>

  {/* NAV BUTTONS (all spacing controlled here) */}
  <div className="flex items-center gap-6">  
      
      {/* Home */}
      <IconButton
        size="large"
        className="!text-accent-200"
        onClick={() => {
          if (pathname === "/" && isOpen) toggle();
          else router.push("/");
        }}
      >
        {isActive("/") && !isOpen
          ? <Home sx={{ fontSize: 36 }} />
          : <HomeOutlined sx={{ fontSize: 36 }} />}
      </IconButton>

      {/* Settings */}
      <Link href="/settings">
        <IconButton size="large" className="!text-accent-200">
          {isActive("/settings")
            ? <Settings sx={{ fontSize: 36 }} />
            : <SettingsOutlined sx={{ fontSize: 36 }} />}
        </IconButton>
      </Link>

      {/* Notification */}
      <IconButton
        size="large"
        className="!text-accent-200"
        onClick={handleBellClick}
      >
        {isOpen
          ? <Notifications sx={{ fontSize: 36 }} />
          : <NotificationsNone sx={{ fontSize: 36 }} />}
      </IconButton>

      {/* Profile / Sign in */}
      {isLoggedIn ? (
        <Link href={`/user/${user?.user_name}`}>
          <Avatar
            src={user?.profile_picture ?? "/default-avatar.png"}
            className="cursor-pointer"
          />
        </Link>
      ) : (!isLoading && (
        <Link
          href="/signup"
          className="font-display font-semibold text-xl text-primary-0 rounded-full bg-white py-2 px-6 hover:bg-accent-200"
        >
          Sign in
        </Link>
      ))}

  </div>
</nav>
  );
}