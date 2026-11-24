
import Link from "next/link";
import Image from "next/image";



export default function NotFound() {
  return (
    <div className="not-found-page min-h-screen flex flex-col bg-[#F7F9F5] text-[#17382B]">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center">

        {/* Error Label */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1EB] px-4 py-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D98C6A]" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium text-[#17382B]">
            Folio No. 404 · Uncataloged Page
          </span>
        </div>

        {/* 404 Number */}
        <h1 className="font-serif text-6xl sm:text-7xl font-bold text-[#17382B] mb-1">
          404
        </h1>

        {/* Floating Book Image */}
        <div className="w-full max-w-85 sm:max-w-97.5 my-1 animate-book-float">
          <Image
            src="/404-bg.png"
            alt="An open magical book with pages floating"
            width={500}
            height={380}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Error Message */}
        <h2 className="font-serif text-3xl sm:text-[32px] leading-tight text-[#17382B] max-w-92.5 mt-2">
          Looks Like This Page Got Lost
          <br className="hidden sm:block" /> Between the Pages.
        </h2>

        <p className="text-sm sm:text-[15px] text-[#66736B] leading-6 max-w-97.5 mt-3">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7 mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#173F34] text-white text-sm font-medium shadow-md hover:bg-[#245443] hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v12h14V9" />
              <path d="M9 21v-7h6v7" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#17382B] border-b border-[#AAB8AD] pb-1 hover:text-[#C47451] hover:border-[#C47451] transition-colors"
          >
            Browse Books
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Decorative Quote */}
        <div className="w-full max-w-82.5 flex items-center gap-3 mt-9">
          <div className="h-px flex-1 bg-[#D9E0D8]" />
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C47451"
            strokeWidth="1.5"
          >
            <path d="M3 5h8v14H3zM13 5h8v14h-8z" />
            <path d="M7 9h1M17 9h1" />
          </svg>
          <div className="h-px flex-1 bg-[#D9E0D8]" />
        </div>

        <p className="font-serif italic text-xs text-[#68756D] max-w-92.5 leading-5 mt-4">
          “Not all those who wander are lost—some are simply searching the upper shelves.”
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE3DB] py-5 px-4 text-center">
        <p className="text-[11px] text-[#68756D]">
          © 2026 BookNook — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
