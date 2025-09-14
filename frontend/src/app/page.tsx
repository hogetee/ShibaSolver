import FeedPageContent from '@/pages/FeedPageContent';
import Image from "next/image";
import Link from "next/link";
import Post, { PostData } from "@/components/post/Post";

export default function FeedPage() {
  return (
    <div className="min-h-screen pt-16">
      <FeedPageContent />
    </div>
  );
}
