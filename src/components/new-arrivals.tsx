"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard, { type Book } from "./book-card";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?limit=6`)
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch books:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center py-20">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#C47451] border-t-transparent" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[#C47451]">
            Fresh on the shelves
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#17382B] md:text-3xl">New Arrivals</h2>
        </div>
        <Link
          href="/all-books"
          className="rounded-full border border-[#17382B] px-5 py-2 text-sm font-semibold text-[#17382B] transition-colors hover:bg-[#17382B] hover:text-[#F5F6F1]"
        >
          See All Books
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <p className="py-8 text-center text-gray-500">No books yet — be the first to add one!</p>
      )}
    </section>
  );
}