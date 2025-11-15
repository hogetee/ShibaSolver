"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeOutlined, Home,
  FavoriteBorder, Favorite,
  SettingsOutlined, Settings,
  NotificationsNone, Notifications,
  Search as SearchIcon,
} from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type User = {
  username: string;
  image: string;
};

export default function TopMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { isOpen, toggle, open } = useNotification();

  const { user, isLoading, refetch } = useCurrentUser(); //USE THIS VERSION OF THE PROFILE BUTTON, WORKING PROPERLY 
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

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">

      {/* Logo */}
      <Link href="/" className="font-sans font-black text-3xl mr-6 text-white px-4">
        Shiba
      </Link>

      <div className="flex items-center space-x-3 ml-6">

        {/* Home */}
        <Link href="/" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/") && !isOpen
              ? <Home sx={{ fontSize: 36 }} />
              : <HomeOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* Favorites */}
        <Link href="/favorites" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/favorites")
              ? <Favorite sx={{ fontSize: 36 }} />
              : <FavoriteBorder sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* Settings */}
        <Link href="/settings" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/settings")
              ? <Settings sx={{ fontSize: 36 }} />
              : <SettingsOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* Notification Bell */}
        <IconButton
          size="large"
          className="!text-accent-200"
          onClick={handleBellClick}
          aria-pressed={isOpen}
        >
          {isOpen
            ? <Notifications sx={{ fontSize: 36 }} />
            : <NotificationsNone sx={{ fontSize: 36 }} />}
        </IconButton>

        {/* USE THIS VERSION OF THE PROFILE BUTTON, WORKING PROPERLY Profile or Sign In */}
        {isLoggedIn ? (
          <Link href={`/user/${user?.user_name}`}>
            <Avatar src={user?.profile_picture ?? "/default-avatar.png"} />
          </Link>
        ) : (isLoading ? null : (
          <Link
            href="/signup"
            className="font-display font-semibold text-xl mr-6 text-primary-0 rounded-full bg-white py-2 px-4 hover:bg-accent-200"
          >
            Sign in
          </Link>
        ))}
      </div>
    </nav>
  );
}