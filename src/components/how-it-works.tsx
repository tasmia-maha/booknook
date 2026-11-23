import { BookOpen, BookMarked, Undo2 } from "lucide-react";

const steps = [
  {
    no: "01",
    title: "Discover",
    desc: "Browse the shelves or filter by category to find a book worth your evening.",
    meta: "Free forever — no membership process.",
    icon: BookOpen,
  },
  {
    no: "02",
    title: "Borrow",
    desc: "One click on Borrow Now, and the book lands in your My Borrows shelf.",
    meta: "Available copies update in real time.",
    icon: BookMarked,
  },
  {
    no: "03",
    title: "Return",
    desc: "Finished reading? Return it from My Borrows and someone else gets a turn.",
    meta: "Copies are counted back instantly.",
    icon: Undo2,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-[#FBFAF6] py-16 border-t border-[#E5E3DC]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7B847E]">
            The BookNook way
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[#17382B] sm:text-4xl">
            How BookNook works
          </h2>
          <p className="mt-2 text-sm text-[#5C6660]">
            A gentler way to browse, read, and return — without algorithms or night modes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.no}
              className="rounded-xl border border-[#E5E3DC] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8A938D]">{s.no}</span>
                <s.icon className="h-5 w-5 text-[#C47451]" />
              </div>
              <h3 className="mt-4 font-serif text-lg text-[#17382B]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C6660]">{s.desc}</p>
              <p className="mt-4 border-t border-[#E5E3DC] pt-3 text-xs text-[#8A938D]">
                {s.meta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}