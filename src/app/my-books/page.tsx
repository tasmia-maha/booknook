import type { Metadata } from "next";
import MyBooks from "@/components/my-books";

export const metadata: Metadata = {
  title: "BookNook | My Books",
  description: "Manage the books you have shared with the BookNook community.",
};

export default function MyBooksPage() {
  return <MyBooks />;
}