// src/components/topMenu/TopMenu.tsx
"use client";

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
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function TopMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { isOpen, toggle, open } = useNotification();

  // ✅ Use your hook instead of custom fetch mess
  const { user, isLoading } = useCurrentUser();

  const isLoggedIn = !!user;

  // ✅ Active page check
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // ✅ Bell logic
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

        {/* Profile or Sign In */}
        {isLoading ? null : isLoggedIn ? (
          <Link href={`/user/${user.user_name}`} passHref>
            <IconButton size="large" className="p-0 ml-3">
              <Avatar
                alt={user.display_name}
                src={user.profile_picture || "/image/DefaultAvatar.png"}
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