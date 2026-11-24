"use client"
import Link from "next/link";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  totalCopies: number;
  publicationYear?: number;
  language?: string;
  publisher?: string;
  addedByName?: string;
  addedByEmail?: string;
  createdAt?: string;
}

export default function BookCard({ book }: { book: Book }) {
  const available = book.totalCopies > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E8E6DE] bg-white transition-shadow duration-300 hover:shadow-lg">
      {/* cover */}
      <div className="relative h-56 w-full bg-[#F0EFE9]">
        {book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={book.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No cover
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#17382B] px-3 py-1 text-xs font-medium text-[#F5F6F1]">
          {book.category}
        </span>
      </div>

      {/* info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-lg font-semibold text-[#17382B]">{book.title}</h3>
        <p className="mt-0.5 text-sm text-gray-500">by {book.author}</p>
        <p className={`mt-1 text-sm font-medium ${available ? "text-emerald-600" : "text-red-500"}`}>
          {available
            ? `Available to borrow (${book.totalCopies} copies)`
            : "Not Available"}
        </p>
        <Link
          href={`/book/${book._id}`}
          className="mt-auto pt-3 text-sm font-semibold text-[#C47451] hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}