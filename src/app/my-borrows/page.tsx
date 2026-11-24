import type { Metadata } from "next";
import MyBorrows from "@/components/my-borrows";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
};

export default function MyBorrowsPage() {
  return <MyBorrows />;
}