"use client";
import { useEffect, useMemo, useState } from "react";
import BookCard, { type Book } from "./book-card";

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // shob book theke unique category gulo ber kora
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ["All", ...Array.from(set)];
  }, [books]);

  const filtered =
    activeCategory === "All"
      ? books
      : books.filter((b) => b.category === activeCategory);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#C47451] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#17382B]">All Books</h1>
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load books. Make sure the Express server is running (port 5050).
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#17382B]">All Books</h1>
      <p className="mt-1 text-gray-500">
        Browse every book in our library — {books.length}{" "}
        {books.length === 1 ? "book" : "books"} total
      </p>

      {/* category filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#17382B] text-[#F5F6F1]"
                : "border border-[#17382B]/20 text-[#17382B] hover:bg-[#17382B]/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* books grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          {activeCategory === "All"
            ? "No books yet — be the first to add one!"
            : `No books in "${activeCategory}" category yet.`}
        </p>
      )}
    </section>
  );
}