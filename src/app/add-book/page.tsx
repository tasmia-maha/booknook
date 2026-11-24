import type { Metadata } from "next";
import AddBook from "@/components/add-book";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description: "Contribute a book to the BookNook community library.",
};

export default function AddBookPage() {
  return <AddBook />;
}