"use client";

import Image from "next/image";
import Link from "next/link";
import Post, { PostData } from "@/components/post/Post";
import FeedPageContent from '@/components/FeedPageContent';
import { NotificationProvider } from "@/context/NotificationContext";


export default function FeedPage() {
  return (
    <div className="min-h-screen pt-16">
        <FeedPageContent />
    </div>
  );
}
