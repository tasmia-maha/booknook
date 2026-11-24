"use client";

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";


const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
  "Productivity",
  "Self-Help",
];

interface BorrowRecord {
  _id: string;
  bookId: string;
  email: string;
  bookTitle: string;
  bookAuthor?: string;
  bookImage: string;
  category: string;
  contributor?: string;
  borrowDate: string;
  dueDate: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Due date pass hole badge red hoye "Overdue" dekhabe
function statusOf(b: BorrowRecord) {
  return new Date(b.dueDate) < new Date() ? "Overdue" : "Borrowed";
}

export default function MyBorrows() {
  const [userEmail, setUserEmail] = useState("");
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [returnTarget, setReturnTarget] = useState<BorrowRecord | null>(null);
  const [returning, setReturning] = useState(false);

  // NOTE: effect er bhitore sync setState nei — shob setState await er por
  const loadData = useCallback(async () => {
  if (!userEmail) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    setBorrows(Array.isArray(data) ? data : []);
    setError(false);
  } catch (err) {
    console.error("Failed to load borrows:", err);
    setError(true);
  } finally {
    setLoading(false);
  }
}, [userEmail]);

  useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Not logged in");
      }

      const data = await res.json();
      const email = data?.user?.email || "";
        setUserEmail(email);
        if (!email) setLoading(false);
    } catch (err) {
        console.error("Failed to load user:", err);
        setLoading(false);
    }
  }

  loadUser();
}, []);

  useEffect(() => {
  if (userEmail) {
    loadData();
  }
}, [userEmail, loadData]);

  const filteredBorrows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = borrows.filter((b) => {
      const matchSearch =
        !q ||
        b.bookTitle.toLowerCase().includes(q) ||
        (b.bookAuthor || "").toLowerCase().includes(q);
      const matchCategory = categoryFilter === "All" || b.category === categoryFilter;
      return matchSearch && matchCategory;
    });
    return [...list].sort((a, b) => {
      const ta = new Date(a.borrowDate).getTime();
      const tb = new Date(b.borrowDate).getTime();
      return sort === "newest" ? tb - ta : ta - tb;
    });
  }, [borrows, search, categoryFilter, sort]);

  async function handleReturnConfirm() {
    if (!returnTarget) return;
    setReturning(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows/${returnTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success(
        `"${returnTarget.bookTitle}" has been returned. Thanks for reading with BookNook!`
      );
      setReturnTarget(null);
      await loadData();
    } catch (err) {
      console.error("Failed to return book:", err);
      toast.error("Could not return the book right now. Please try again.");
    } finally {
      setReturning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F1]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17382B] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F1]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* 1. Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#17382B] sm:text-4xl">My Borrows</h1>
          <p className="mt-2 text-gray-600">
            Keep track of the books you&apos;ve borrowed from the BookNook community.
          </p>
        </header>

        {/* 2. Statistics Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8E6DE] bg-white p-5">
            <p className="text-3xl font-bold text-[#17382B]">{borrows.length}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Total Borrowed</p>
          </div>
          <div className="rounded-2xl border border-[#E8E6DE] bg-white p-5">
            <p className="text-3xl font-bold text-[#C47451]">{borrows.length}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Currently Borrowed</p>
          </div>
        </section>

        {/* 3. Search & Category Filter */}
        <section className="mb-8 rounded-2xl border border-[#E8E6DE] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="rounded-xl border border-[#E8E6DE] px-4 py-2.5 text-sm text-[#17382B] placeholder:text-gray-400 focus:border-[#17382B] focus:outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#E8E6DE] bg-white px-4 py-2.5 text-sm text-[#17382B] focus:border-[#17382B] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
              className="rounded-xl border border-[#E8E6DE] bg-white px-4 py-2.5 text-sm text-[#17382B] focus:border-[#17382B] focus:outline-none"
            >
              <option value="newest">Newest Borrowed</option>
              <option value="oldest">Oldest Borrowed</option>
            </select>
          </div>
        </section>

        {/* 4. Borrowed Books List */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#17382B]">My Borrowed Books</h2>
            <span className="rounded-full bg-[#17382B] px-3 py-1 text-xs font-semibold text-white">
              {filteredBorrows.length} Active
            </span>
          </div>

          {error ? (
            <div className="rounded-2xl border border-[#E8E6DE] bg-white px-6 py-12 text-center">
              <p className="text-gray-600">Could not load your borrowed books. Please try again.</p>
              <button
                onClick={() => loadData()}
                className="mt-4 rounded-full bg-[#17382B] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2a20]"
              >
                Try Again
              </button>
            </div>
          ) : borrows.length === 0 ? (
            /* 6. Empty State */
            <div className="rounded-2xl border border-[#E8E6DE] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EFE9]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8 text-[#17382B]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-[#17382B]">
                Your Reading Journey Starts Here!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                You haven&apos;t borrowed any books yet. Explore our library and find your next
                favorite read.
              </p>
              <Link
                href="/all-books"
                className="mt-6 inline-block rounded-full bg-[#C47451] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a95f40]"
              >
                Explore Books
              </Link>
            </div>
          ) : filteredBorrows.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E6DE] bg-white px-6 py-12 text-center">
              <p className="text-gray-600">No books match your search or filter.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredBorrows.map((b) => {
                const status = statusOf(b);
                return (
                  <li
                    key={b._id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#E8E6DE] bg-white p-4 sm:flex-row sm:items-center"
                  >
                    {b.bookImage ? (
                      <Image
                        src={b.bookImage}
                        alt={b.bookTitle}
                        width={200}
                        height={300}
                        unoptimized
                        className="h-44 w-full rounded-xl object-cover sm:h-28 sm:w-24"
                    />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center rounded-xl bg-[#F0EFE9] text-2xl font-bold text-[#17382B] sm:h-28 sm:w-24">
                        {b.bookTitle.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#17382B]">{b.bookTitle}</h3>
                      <p className="text-sm text-gray-600">By {b.bookAuthor || "Unknown author"}</p>
                      <p className="text-sm text-gray-500">
                        Contributor: {b.contributor || "Unknown"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#F0EFE9] px-2.5 py-0.5 text-xs font-medium text-[#17382B]">
                          {b.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Borrowed: {formatDate(b.borrowDate)} · Due: {formatDate(b.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span
                        className={
                          status === "Overdue"
                            ? "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                            : "rounded-full bg-[#17382B]/10 px-3 py-1 text-xs font-semibold text-[#17382B]"
                        }
                      >
                        {status}
                      </span>
                      <button
                        onClick={() => setReturnTarget(b)}
                        className="rounded-full bg-[#C47451] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#a95f40]"
                      >
                        Return Book
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* 5. Return Confirmation Modal — browser alert/confirm nei */}
      {returnTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !returning && setReturnTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#17382B]">Return This Book?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to return{" "}
              <span className="font-semibold text-[#17382B]">&quot;{returnTarget.bookTitle}&quot;</span>?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              The book will go back to the library and its available copies will increase by one.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setReturnTarget(null)}
                disabled={returning}
                className="rounded-full border border-[#E8E6DE] px-5 py-2 text-sm font-semibold text-[#17382B] transition hover:bg-[#F0EFE9] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnConfirm}
                disabled={returning}
                className="rounded-full bg-[#C47451] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#a95f40] disabled:opacity-50"
              >
                {returning ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}