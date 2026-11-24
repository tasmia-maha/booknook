"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookCard, { type Book } from "./book-card";

// Borrowing duration — backend e POST /borrows bananor somoy
// dueDate = borrowDate + 7 din hisebe rekho, ei value-r sathe match korbe
const BORROW_DAYS = 7;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#17382B]">{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#E8E6DE] bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#17382B]">{value}</p>
    </div>
  );
}


export default function BookDetails() {
  const [userEmail, setUserEmail] = useState("");
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState("");
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list: Book[] = Array.isArray(data) ? data : [];
        setBooks(list);
        const found = list.find((b) => b._id === id);
        if (found) setBook(found);
        else setNotFound(true);
      })
      .catch((err) => {
        console.error("Failed to fetch book:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    })
    .then((data) => {
      setUserEmail(data.user.email);
    })
    .catch((err) => {
      console.error("Failed to get current user:", err);
    });
  }, []);

  const handleBorrow = async () => {
  if (!userEmail) {
    setBorrowError("Please log in before borrowing a book.");
    return;
  }

  setBorrowing(true);
  setBorrowError("");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book?._id,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to borrow this book.");
    }

    // Refresh book information after successful borrowing
    const booksRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books`
    );

    if (booksRes.ok) {
      const updatedBooks: Book[] = await booksRes.json();

      setBooks(updatedBooks);

      const updatedBook = updatedBooks.find(
        (b) => b._id === id
      );

      if (updatedBook) {
        setBook(updatedBook);
      }
    }

    setBorrowOpen(false);
    alert("Book borrowed successfully!");
  } catch (err) {
    setBorrowError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setBorrowing(false);
  }
  };

  // Same category, current book bad — shudhu 4 ta
  const related = useMemo(() => {
    if (!book) return [];
    return books
      .filter((b) => b.category === book.category && b._id !== book._id)
      .slice(0, 4);
  }, [book, books]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F0EFE9] border-t-[#C47451]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[#17382B]">Could not load this book.</p>
        <p className="mt-2 text-gray-500">
          Make sure the Express server is running (port 5050).
        </p>
        <Link href="/all-books" className="mt-4 inline-block font-medium text-[#C47451] hover:underline">
          ← Back to All Books
        </Link>
      </main>
    );
  }

  if (notFound || !book) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[#17382B]">Book not found.</p>
        <p className="mt-2 text-gray-500">It may have been removed from the library.</p>
        <Link href="/all-books" className="mt-4 inline-block font-medium text-[#C47451] hover:underline">
          ← Back to All Books
        </Link>
      </main>
    );
  }

  const available = book.totalCopies > 0;
  const initials = (book.addedByName || "BookNook")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const dateAdded = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <Link href="/all-books" className="text-sm font-medium text-[#C47451] hover:underline">
        ← Back to All Books
      </Link>

      {/* Top: cover + summary — ager design, unchanged */}
      <section className="mt-4 grid gap-8 rounded-3xl border border-[#E8E6DE] bg-white p-6 md:grid-cols-[320px_1fr] md:p-8">
        <div className="overflow-hidden rounded-2xl border border-[#E8E6DE] bg-[#F0EFE9]">
          {book.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.image} alt={book.title} className="h-95 w-full object-cover" />
          ) : (
            <div className="flex h-95 items-center justify-center text-sm text-gray-400">
              No cover
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="inline-flex w-fit rounded-full bg-[#17382B] px-3 py-1 text-xs font-medium text-[#F5F6F1]">
            {book.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-[#17382B]">{book.title}</h1>
          <p className="mt-1 text-gray-500">by {book.author}</p>

          {/* Hero te chhoto excerpt, full description niche "About This Book" e */}
          {book.description && (
            <p className="mt-4 line-clamp-3 leading-relaxed text-gray-600">{book.description}</p>
          )}

          <div className="mt-5">
            {available ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available — {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"} in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Not Available
              </span>
            )}
          </div>

          {/* TODO: borrow API banano hole ei button ke POST /borrows er sathe wire korbo */}
          <button
            onClick={() => {
              setBorrowError("");
              setBorrowOpen(true);
            }}
            disabled={!available || borrowing}
            className="mt-5 w-fit rounded-xl bg-[#C47451] px-6 py-3 font-semibold text-white transition hover:bg-[#a95f42] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {available ? "Borrow Now" : "Not Available"}
          </button>
        </div>
      </section>

      {/* Book Information */}
      <Section title="Book Information">
        {/* Ekhon borrow nai, tai Total = Available. Borrow logic add hole
            server totalCopies $inc kore komabe, tokhon duita alada dekhabe */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoCard label="Total Copies" value={book.totalCopies} />
          <InfoCard label="Available Copies" value={book.totalCopies} />
          <InfoCard label="Borrowing Duration" value={`${BORROW_DAYS} Days`} />
          <InfoCard label="Publication Year" value={book.publicationYear ?? "—"} />
          <InfoCard label="Language" value={book.language ?? "English"} />
          <InfoCard label="Publisher" value={book.publisher || "—"} />
        </div>
      </Section>

      {/* About This Book */}
      <Section title="About This Book">
        {book.description ? (
          <p className="mt-3 leading-relaxed text-gray-700">{book.description}</p>
        ) : (
          <p className="mt-3 text-gray-500">No description has been added for this book yet.</p>
        )}
      </Section>

      {/* Borrowing Guidelines */}
      <Section title="Borrowing Guidelines">
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
            <span className="font-medium text-[#17382B]">Borrowing Period</span>
            <span className="text-right text-gray-600">{BORROW_DAYS} days</span>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
            <span className="font-medium text-[#17382B]">Return Policy</span>
            <span className="text-right text-gray-600">
              Return the book within {BORROW_DAYS} days so other members can borrow it too.
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
            <span className="font-medium text-[#17382B]">Availability</span>
            {available ? (
              <span className="text-right font-medium text-emerald-600">
                Available to borrow now ({book.totalCopies} copies)
              </span>
            ) : (
              <span className="text-right font-medium text-red-500">Currently not available</span>
            )}
          </div>
        </div>
      </Section>

      {/* Book Shared By */}
      <Section title="Book Shared By">
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17382B] text-sm font-bold text-[#F5F6F1]">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[#17382B]">{book.addedByName || "BookNook Member"}</p>
            <p className="text-sm text-gray-500">{book.addedByEmail || "community member"}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Date Added</p>
            <p className="text-sm font-medium text-[#17382B]">{dateAdded}</p>
          </div>
        </div>
      </Section>

      {/* You May Also Like */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#17382B]">You May Also Like</h2>
          <p className="mt-1 text-sm text-gray-500">{`More from the "${book.category}" category`}</p>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      )}
      {borrowOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-[#17382B]">
        Confirm Borrow
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Please review your borrowing information.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl bg-[#F5F6F1] p-4">
        <div>
          <p className="text-xs text-gray-500">Book Title</p>
          <p className="font-semibold text-[#17382B]">
            {book.title}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Author</p>
          <p className="font-medium text-[#17382B]">
            {book.author}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Borrower Email</p>
          <p className="font-medium text-[#17382B]">
            {userEmail || "Not logged in"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Borrowing Period</p>
          <p className="font-medium text-[#17382B]">
            {BORROW_DAYS} Days
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Return Date</p>
          <p className="font-medium text-[#17382B]">
            {new Date(
              Date.now() + BORROW_DAYS * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {borrowError && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {borrowError}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setBorrowOpen(false);
            setBorrowError("");
          }}
          disabled={borrowing}
          className="flex-1 rounded-xl border border-[#17382B]/20 px-4 py-3 font-semibold text-[#17382B] hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleBorrow}
          disabled={borrowing || !userEmail}
          className="flex-1 rounded-xl bg-[#C47451] px-4 py-3 font-semibold text-white hover:bg-[#a95f42] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {borrowing ? "Processing..." : "Confirm Borrow"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}