"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, BookOpen, Wand2, Code2, Sparkles, Timer, FlaskConical, Landmark, type LucideIcon } from "lucide-react";
import type { Book } from "./book-card";

// jodi category name er match icon thake, seta; nahole BookOpen
const iconMap: Record<string, LucideIcon> = {
  Fiction: BookOpen,
  Fantasy: Wand2,
  Programming: Code2,
  "Self-Help": Sparkles,
  Productivity: Timer,
  Science: FlaskConical,
  History: Landmark,
};

export default function GenreExplorer() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  // database er theke real category + count
  const genres = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((b) => map.set(b.category, (map.get(b.category) ?? 0) + 1));
    return Array.from(map, ([name, count]) => ({ name, count })).slice(0, 5);
  }, [books]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7B847E]">
            This season&rsquo;s quiet shelf
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#17382B] sm:text-4xl">
            Explore by genre
          </h2>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-[#8A938D]">
          Every shelf carries a different intelligences — from remembered worlds to field notes and slow reading lists.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {genres.map((g) => {
          const Icon = iconMap[g.name] ?? BookOpen;
          return (
            <Link
              key={g.name}
              href={`/all-books?category=${encodeURIComponent(g.name)}`}
              className="group rounded-xl border border-[#E5E3DC] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-[#17382B]" />
              <p className="mt-3 font-medium text-[#17382B]">{g.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-[#8A938D]">{g.count} titles</span>
                <ArrowUpRight className="h-4 w-4 text-[#C47451] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
        {genres.length === 0 && (
          <p className="col-span-full py-6 text-sm text-[#8A938D]">
            Genres will appear here once books are added.
          </p>
        )}
      </div>

      {/* helper bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (term.trim()) router.push(`/all-books?search=${encodeURIComponent(term.trim())}`);
        }}
        className="mt-6 flex items-center gap-3 rounded-xl border border-[#E5E3DC] bg-white px-4 py-3 shadow-sm"
      >
        <Search className="h-4 w-4 shrink-0 text-[#8A938D]" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Looking for a specific title? Type the name…"
          className="w-full bg-transparent text-sm text-[#17382B] placeholder:text-[#8A938D] focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-[#C47451] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a95f41]"
        >
          Search
        </button>
      </form>
    </section>
  );
}