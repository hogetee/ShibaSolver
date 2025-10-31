"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  Home,
  FavoriteBorder,
  Favorite,
  SettingsOutlined,
  Settings,
  NotificationsNone,
  Notifications,
  Search as SearchIcon,
} from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";

type User = {
  username: string;
  image?: string;
};

export default function TopMenu() {
  const pathname = usePathname() ?? "";
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ added

  // ✅ Mark as client after first render
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        const storedUsername = localStorage.getItem("username");

        if (storedUserData) {
          const parsed = JSON.parse(storedUserData);
          setUser({
            username: parsed.user_name || storedUsername || "Guest",
            image: parsed.profile_picture || "/default-avatar.png",
          });
          setIsLoggedIn(true);
          return;
        }

        if (storedUsername) {
          setUser({
            username: storedUsername,
            image: "/default-avatar.png",
          });
          setIsLoggedIn(true);
          return;
        }

        setIsLoggedIn(false);
        setUser(null);
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">
      <Link
        href="/"
        className="font-sans font-black text-3xl mr-6 text-white px-4"
      >
        Shiba
      </Link>

      <div className="relative flex-grow mx-8">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full px-5 pr-10 py-1.5 text-black focus:outline-none bg-white border border-gray-300"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <SearchIcon fontSize="small" />
        </button>
      </div>

      <div className="flex items-center space-x-3 ml-6">
        <Link href="/" passHref>
          <IconButton size="large" aria-label="home" className="!text-accent-200">
            {isActive("/") ? <Home sx={{ fontSize: 36 }} /> : <HomeOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/favorites" passHref>
          <IconButton size="large" aria-label="favorites" className="!text-accent-200">
            {isActive("/favorites") ? <Favorite sx={{ fontSize: 36 }} /> : <FavoriteBorder sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/settings" passHref>
          <IconButton size="large" aria-label="settings" className="!text-accent-200">
            {isActive("/settings") ? <Settings sx={{ fontSize: 36 }} /> : <SettingsOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/notifications" passHref>
          <IconButton size="large" aria-label="notifications" className="!text-accent-200">
            {isActive("/notifications") ? <Notifications sx={{ fontSize: 36 }} /> : <NotificationsNone sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* ✅ Prevent hydration mismatch */}
        {!isClient ? null : isLoggedIn ? (
          <Link href={`/user/${user?.username}`} passHref>
            <IconButton size="large" className="p-0 ml-3">
              <Avatar
                alt={user?.username}
                src={user?.image || "/default-avatar.png"}
                className="w-8 h-8"
              />
            </IconButton>
          </Link>
        ) : (
          <Link
            href="/signup"
            className="font-display font-semibold text-xl mr-6 text-primary-0 rounded-full bg-white py-2 px-4 hover:bg-accent-200"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}