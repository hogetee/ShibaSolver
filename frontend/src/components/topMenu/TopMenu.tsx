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
  const [isClient, setIsClient] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUsername = localStorage.getItem("username");

        if (!storedUsername) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        // ✅ Verify login with backend
        const res = await fetch(
          `http://localhost:5000/api/v1/users/${storedUsername}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const json = await res.json();

        if (!json.success) {
          // ❌ Username invalid or user logged out at server
          localStorage.removeItem("username");
          localStorage.removeItem("userData");
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        // ✅ Login confirmed
        const backendUser = json.data;

        setUser({
          username: backendUser.user_name,
          image: backendUser.profile_picture || "/default-avatar.png",
        });

        // ✅ Replace stale data in local storage
        localStorage.setItem("username", backendUser.user_name);
        localStorage.setItem("userData", JSON.stringify(backendUser));

        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    // ✅ Listen to login updates from other tabs
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">
      {/* Logo */}
      <Link href="/" className="font-sans font-black text-3xl mr-6 text-white px-4">
        Shiba
      </Link>

      
      {/* Nav Icons */}
      <div className="flex items-center space-x-3 ml-6">
        <Link href="/" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/") ? <Home sx={{ fontSize: 36 }} /> : <HomeOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/favorites" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/favorites") ? <Favorite sx={{ fontSize: 36 }} /> : <FavoriteBorder sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/settings" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/settings") ? <Settings sx={{ fontSize: 36 }} /> : <SettingsOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        <Link href="/notifications" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/notifications") ? <Notifications sx={{ fontSize: 36 }} /> : <NotificationsNone sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* ✅ Safe client render */}
        {!isClient ? null : isLoggedIn && user ? (
          <Link href={`/user/${user.username}`} passHref>
            <IconButton size="large" className="p-0 ml-3">
              <Avatar
                alt={user.username}
                src={user.image}
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