"use client";


import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const EDIT_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

const inputClass =
  "w-full rounded-xl border border-[#E8E6DE] bg-white px-4 py-2.5 text-sm text-[#17382B] outline-none transition focus:border-[#C47451] focus:ring-2 focus:ring-[#C47451]/20";
const labelClass = "mb-1.5 block text-sm font-medium text-[#17382B]";
const filterClass =
  "rounded-xl border border-[#E8E6DE] bg-white px-4 py-2.5 text-sm text-[#17382B] outline-none focus:border-[#C47451]";

interface MyBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  totalCopies: number;
  addedByName?: string;
  addedByEmail?: string;
  createdAt?: string;
}

interface BorrowRecord {
  _id: string;
  bookId: string;
}

interface EditForm {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: string;
}

type SortOrder = "newest" | "oldest";

export default function MyBooks() {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [editing, setEditing] = useState<MyBook | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<MyBook | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  const loadData = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setBooks([]);
      setBorrows([]);
      setLoading(false);
      return;
    }

    try {
      const [booksRes, borrowsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
          credentials: "include",
        }),
      ]);

      if (!booksRes.ok) throw new Error(`HTTP ${booksRes.status}`);
      if (!borrowsRes.ok) throw new Error(`HTTP ${borrowsRes.status}`);

      const allBooks = await booksRes.json();
      const allBorrows = await borrowsRes.json();

      const list: MyBook[] = Array.isArray(allBooks) ? allBooks : [];

      setBooks(
        list.filter(
          (b) => (b.addedByEmail || "").toLowerCase() === user.email.toLowerCase()
        )
      );

      setBorrows(Array.isArray(allBorrows) ? allBorrows : []);
      setError(false);
    } catch (err) {
      console.error("Failed to load my books:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const borrowedCount = (bookId: string) =>
    borrows.filter((b) => b.bookId === bookId).length;

  const categories = useMemo(
    () => Array.from(new Set(books.map((b) => b.category))),
    [books]
  );

  const totalAvailable = books.reduce((sum, b) => sum + b.totalCopies, 0);

  const visibleBooks = useMemo(() => {
    let list = [...books];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") {
      list = list.filter((b) => b.category === categoryFilter);
    }
    list.sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return list;
  }, [books, search, categoryFilter, sortOrder]);

  function openEdit(book: MyBook) {
    setEditing(book);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image || "",
      description: book.description || "",
      totalCopies: String(book.totalCopies + borrowedCount(book._id)),
    });
  }

  async function handleEditSave(e: FormEvent) {
    e.preventDefault();
    if (!editing || !editForm) return;
    if (!editForm.title.trim() || !editForm.author.trim() || !editForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newTotal = Number(editForm.totalCopies);
    const borrowed = borrowedCount(editing._id);
    if (!Number.isInteger(newTotal) || newTotal < borrowed) {
      toast.error(`Total copies cannot be less than ${borrowed} borrowed copies`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${editing._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          author: editForm.author.trim(),
          category: editForm.category,
          image: editForm.image.trim(),
          description: editForm.description.trim(),
          totalCopies: newTotal,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Failed to update book");
      toast.success("Book updated successfully!");
      setEditing(null);
      setEditForm(null);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleting) return;
    setDeletingInProgress(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${deleting._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Failed to delete book");
      toast.success("Book removed from your collection");
      setDeleting(null);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed. Please try again.");
    } finally {
      setDeletingInProgress(false);
    }
  }

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
        <p className="text-lg font-semibold text-[#17382B]">Could not load your books.</p>
        <p className="mt-2 text-gray-500">Make sure the Express server is running (port 5050).</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[#C47451]">Home</Link>
        <span className="mx-1">/</span>
        <span className="font-medium text-[#17382B]">My Books</span>
      </p>

      {/* Heading + Add button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#17382B]">My Collection</h1>
          <p className="mt-1 text-gray-500">
            Manage the books you&apos;ve shared with the BookNook community.
          </p>
        </div>
        <Link
          href="/add-book"
          className="rounded-xl bg-[#C47451] px-5 py-2.5 font-semibold text-white transition hover:bg-[#a95f42]"
        >
          + Add New Book
        </Link>
      </div>

      {/* Statistics */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-[#17382B]">Your Collection at a Glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#E8E6DE] bg-white p-6">
            <p className="text-3xl font-bold text-[#17382B]">{books.length}</p>
            <p className="mt-1 text-sm text-gray-500">Total Books Added</p>
          </div>
          <div className="rounded-3xl border border-[#E8E6DE] bg-white p-6">
            <p className="text-3xl font-bold text-emerald-600">{totalAvailable}</p>
            <p className="mt-1 text-sm text-gray-500">Available Copies</p>
          </div>
          <div className="rounded-3xl border border-[#E8E6DE] bg-white p-6">
            <p className="text-3xl font-bold text-[#C47451]">{categories.length}</p>
            <p className="mt-1 text-sm text-gray-500">Categories</p>
          </div>
        </div>
      </section>

      {/* Search & filters */}
      {books.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <input
            className={`${filterClass} w-64`}
            placeholder="Search by book title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={filterClass}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className={filterClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      )}

      {/* Empty collection */}
      {books.length === 0 && (
        <div className="mt-8 rounded-3xl border border-[#E8E6DE] bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-[#17382B]">Your Collection is Waiting to Grow.</h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            You haven&apos;t shared any books yet. Add your first book and help another reader
            discover a new story.
          </p>
          <Link
            href="/add-book"
            className="mt-5 inline-block rounded-xl bg-[#C47451] px-6 py-3 font-semibold text-white transition hover:bg-[#a95f42]"
          >
            + Add Your First Book
          </Link>
        </div>
      )}

      {/* No search/filter match */}
      {books.length > 0 && visibleBooks.length === 0 && (
        <p className="mt-8 rounded-3xl border border-[#E8E6DE] bg-white p-8 text-center text-gray-500">
          No books match your search or filter.
        </p>
      )}

      {/* Desktop table */}
      {visibleBooks.length > 0 && (
        <div className="mt-6 hidden overflow-hidden rounded-3xl border border-[#E8E6DE] bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F6F1] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleBooks.map((book) => (
                <tr key={book._id} className="border-t border-[#E8E6DE]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {book.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.image} alt={book.title} className="h-14 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-14 w-10 items-center justify-center rounded-lg bg-[#F0EFE9] text-[10px] text-gray-400">No cover</div>
                      )}
                      <span className="max-w-55 truncate font-medium text-[#17382B]">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#17382B] px-2.5 py-1 text-xs font-medium text-[#F5F6F1]">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#17382B]">
                    {book.totalCopies + borrowedCount(book._id)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={book.totalCopies > 0 ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
                      {book.totalCopies}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(book)}
                        className="rounded-lg border border-[#E8E6DE] px-3 py-1.5 text-xs font-medium text-[#C47451] transition hover:border-[#C47451]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(book)}
                        className="rounded-lg border border-[#E8E6DE] px-3 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {visibleBooks.length > 0 && (
        <div className="mt-6 space-y-4 md:hidden">
          {visibleBooks.map((book) => (
            <div key={book._id} className="rounded-3xl border border-[#E8E6DE] bg-white p-4">
              <div className="flex gap-3">
                {book.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={book.image} alt={book.title} className="h-20 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-14 items-center justify-center rounded-xl bg-[#F0EFE9] text-[10px] text-gray-400">No cover</div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#17382B]">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <span className="mt-1 inline-block rounded-full bg-[#17382B] px-2 py-0.5 text-[10px] font-medium text-[#F5F6F1]">
                    {book.category}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#E8E6DE] pt-3 text-xs">
                <p className="text-gray-600">
                  Total: <span className="font-semibold text-[#17382B]">{book.totalCopies + borrowedCount(book._id)}</span>
                  {" · "}Available:{" "}
                  <span className={book.totalCopies > 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                    {book.totalCopies}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(book)} className="rounded-lg border border-[#E8E6DE] px-3 py-1.5 font-medium text-[#C47451]">Edit</button>
                  <button onClick={() => setDeleting(book)} className="rounded-lg border border-[#E8E6DE] px-3 py-1.5 font-medium text-red-500">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => { setEditing(null); setEditForm(null); }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#17382B]">Edit Book Details</h3>
            <form onSubmit={handleEditSave} className="mt-5 space-y-4">
              <div>
                <label className={labelClass}>Book Title *</label>
                <input className={inputClass} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Author Name *</label>
                <input className={inputClass} value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select className={inputClass} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  {Array.from(new Set([editForm.category, ...EDIT_CATEGORIES])).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Book Image (URL)</label>
                {editForm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editForm.image} alt="Cover preview" className="mb-2 h-24 w-16 rounded-lg object-cover" />
                )}
                <input className={inputClass} value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="Cover image URL (optional)" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} className={inputClass} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Total Copies *</label>
                <input
                  type="number"
                  min={borrowedCount(editing._id)}
                  className={inputClass}
                  value={editForm.totalCopies}
                  onChange={(e) => setEditForm({ ...editForm, totalCopies: e.target.value })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {borrowedCount(editing._id)} {borrowedCount(editing._id) === 1 ? "copy is" : "copies are"} currently borrowed.
                  Available copies will be calculated automatically.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#C47451] px-6 py-3 font-semibold text-white transition hover:bg-[#a95f42] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(null); setEditForm(null); }}
                  className="rounded-xl border border-[#E8E6DE] px-6 py-3 font-semibold text-[#17382B] transition hover:bg-[#F5F6F1]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#17382B]">Delete This Book?</h3>
            <p className="mt-2 text-gray-500">
              Are you sure you want to remove <span className="font-semibold text-[#17382B]">{deleting.title}</span> from
              your collection? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingInProgress}
                className="flex-1 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                {deletingInProgress ? "Deleting..." : "Delete Book"}
              </button>
              <button
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-[#E8E6DE] px-6 py-3 font-semibold text-[#17382B] transition hover:bg-[#F5F6F1]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}