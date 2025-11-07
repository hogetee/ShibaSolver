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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  useEffect(() => {
    setIsClient(true); // ✅ prevents hydration mismatch
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!isClient) return;

      try {
        const storedUsername = localStorage.getItem("username");
        const storedUserData = localStorage.getItem("userData");

        // ✅ No username = not logged in
        if (!storedUsername) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        // ✅ Check with backend if this user still exists
        const res = await fetch(`${API_BASE}/api/v1/users/${storedUsername}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!data?.success) {
          // ❌ Backend says user does NOT exist => logout
          localStorage.removeItem("username");
          localStorage.removeItem("userData");
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        // ✅ User exists -> update user info
        const profile = data.data;
        const avatar = profile.profile_picture || "/default-avatar.png";

        // ✅ Save newest profile data
        localStorage.setItem("userData", JSON.stringify(profile));

        setUser({
          username: profile.user_name,
          image: avatar,
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [isClient]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // ✅ Avoid hydration errors until client is ready
  if (!isClient) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-dark-900 shadow-md flex justify-between items-center px-8 z-50">
      <Link href="/" className="font-sans font-black text-3xl mr-6 text-white px-4">
        Shiba
      </Link>

      

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

        {/* ✅ show profile OR sign in */}
        {isLoggedIn ? (
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