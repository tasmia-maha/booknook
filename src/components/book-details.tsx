"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Book } from "./book-card";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data) => setBook(data))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#C47451] border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#17382B]">Book not found</h1>
        <p className="mt-2 text-gray-500">This book may have been removed.</p>
        <Link
          href="/all-books"
          className="mt-6 inline-block rounded-full bg-[#17382B] px-6 py-2 text-sm font-semibold text-[#F5F6F1]"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  const available = book.totalCopies > 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/all-books" className="text-sm font-medium text-[#C47451] hover:underline">
        ← Back to All Books
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* cover */}
        <div className="relative aspect-2/3 mx-auto max-w-sm h-105 w-full rounded-2xl bg-[#F0EFE9]">
          {book.image ? (
            <Image
              src={book.image}
              alt={book.title}
              width={400}
              height={700}
              unoptimized
              className="w-full h-auto object-contain rounded-xl"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">No cover</div>
          )}
        </div>

        {/* info */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-[#17382B] px-3 py-1 text-xs font-medium text-[#F5F6F1]">
            {book.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#17382B]">{book.title}</h1>
          <p className="mt-1 text-gray-500">by {book.author}</p>

          <p className="mt-4 leading-relaxed text-gray-700">
            {book.description || "No description available."}
          </p>

          <div className="mt-6 text-sm font-medium">
            {available ? (
              <span className="text-emerald-600">
                Available to borrow — {book.totalCopies} copies left
              </span>
            ) : (
              <span className="text-red-500">Not Available</span>
            )}
          </div>

          {/* assignment challenge: copies 0 hole button disable */}
          <button
            disabled={!available}
            className="mt-6 w-fit rounded-full bg-[#C47451] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a95f41] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {available ? "Borrow Now" : "Not Available"}
          </button>

          {/* borrow modal + API call pore ashbe — auth er por */}
        </div>
      </div>
    </section>
  );
}