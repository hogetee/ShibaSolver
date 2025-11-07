// src/components/topMenu/TopMenu.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeOutlined, Home,
  FavoriteBorder, Favorite,
  SettingsOutlined, Settings,
  NotificationsNone, Notifications,
} from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";

type User = { username: string; image?: string };

export default function TopMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const { isOpen, toggle, open } = useNotification();

  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  // ✅ Avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Load user login state
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/v1/users/${username}`, {
          credentials: "include",
        });

        const json = await res.json();
        if (!json.success) {
          localStorage.removeItem("username");
          localStorage.removeItem("userData");
          setUser(null);
          setIsLoggedIn(false);
          return;
        }

        const data = json.data;
        localStorage.setItem("userData", JSON.stringify(data));

        setUser({
          username: data.user_name,
          image: data.profile_picture || "/default-avatar.png",
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [isClient, API_BASE]);

  // ✅ Detect current page
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // ✅ Notification bell behavior
  const handleBellClick = () => {
    if (pathname !== "/") {
      // ✅ Go to feed and open notifications automatically
      router.push("/");

      setTimeout(() => {
        open();
      }, 180);

      return;
    }

    // ✅ Already on feed — just toggle sidebar
    toggle();
  };

  if (!isClient) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">

      {/* ✅ Logo */}
      <Link href="/" className="font-sans font-black text-3xl mr-6 text-white px-4">
        Shiba
      </Link>

      <div className="flex items-center space-x-3 ml-6">

        {/* ✅ Home */}
        <Link href="/" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/") && !isOpen ? (
              <Home sx={{ fontSize: 36 }} />
            ) : (
              <HomeOutlined sx={{ fontSize: 36 }} />
            )}
          </IconButton>
        </Link>

        {/* ✅ Favorites */}
        <Link href="/favorites" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/favorites") ? <Favorite sx={{ fontSize: 36 }} /> : <FavoriteBorder sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* ✅ Settings */}
        <Link href="/settings" passHref>
          <IconButton size="large" className="!text-accent-200">
            {isActive("/settings") ? <Settings sx={{ fontSize: 36 }} /> : <SettingsOutlined sx={{ fontSize: 36 }} />}
          </IconButton>
        </Link>

        {/* ✅ Notification Bell */}
        <IconButton
          size="large"
          className="!text-accent-200"
          onClick={handleBellClick}
          aria-pressed={isOpen}
        >
          {isOpen ? (
            <Notifications sx={{ fontSize: 36 }} />
          ) : (
            <NotificationsNone sx={{ fontSize: 36 }} />
          )}
        </IconButton>

        {/* ✅ Profile OR Sign In */}
        {isLoggedIn ? (
          <Link href={`/user/${user?.username}`} passHref>
            <IconButton size="large" className="p-0 ml-3">
              <Avatar
                alt={user?.username}
                src={user?.image}
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