import type { Metadata } from "next";
import Profile from "@/components/profile";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
};

export default function ProfilePage() {
  return <Profile />;
}