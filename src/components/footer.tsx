const BookNookLogo: React.FC = () => (
  <div className="flex items-center gap-3 select-none">
    <svg
      width="42"
      height="34"
      viewBox="0 0 48 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M24 10.5C20.5 7.2 12.5 6.8 5 8.5V31.5C12.5 29.8 20.5 30.2 24 33.5C27.5 30.2 35.5 29.8 43 31.5V8.5C35.5 6.8 27.5 7.2 24 10.5Z"
        fill="#F6F3EC"
        stroke="#17382B"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="24"
        y1="10.5"
        x2="24"
        y2="34.2"
        stroke="#C47451"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M24.5 9.5C25.2 5.2 29.2 3.2 33 4.2C32.2 8.2 28.5 10.2 24.5 9.5Z"
        fill="#17382B"
      />
    </svg>
    <span className="font-serif text-[28px] sm:text-[30px] font-bold tracking-tight text-[#C47451] leading-none inline-flex items-baseline">
      BookNook
    </span>
  </div>
);
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#17382B] text-[#F5F6F1]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <BookNookLogo/>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#F5F6F1]/70">
            A community mini-library where members share their favourite books, borrow freely,
            and return them within 7 days.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F6F1]/60">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#F5F6F1]/80">
            <li>hello@booknook.example</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F6F1]/60">Follow Us</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {["Facebook", "Instagram", "GitHub"].map((s) => (
              <a
                key={s}
                href="/NotFound"
                className="rounded-full border border-[#F5F6F1]/20 px-4 py-1.5 text-sm text-[#F5F6F1]/80 transition hover:border-[#C47451] hover:text-[#C47451]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#F5F6F1]/10 py-4 text-center text-xs text-[#F5F6F1]/60">
        © {year} BookNook — All rights reserved.
      </div>
    </footer>
  );
}