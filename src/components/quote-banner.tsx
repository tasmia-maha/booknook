import { Quote } from "lucide-react";

export default function QuoteBanner() {
  return (
    <section className="w-full bg-[#133A2A] px-4 py-20 text-center">
      <Quote className="mx-auto h-8 w-8 text-[#C47451]" />
      <h2 className="mx-auto mt-6 max-w-2xl font-serif text-3xl leading-snug text-[#F5F6F1] sm:text-4xl">
        Books are a uniquely portable magic.
      </h2>
      <p className="mt-4 text-sm font-medium text-[#C47451]">— Stephen King</p>
      <p className="mt-10 text-xs uppercase tracking-[0.18em] text-[#F5F6F1]/60">
        Great stories were meant to travel — from our shelves to yours
      </p>
    </section>
  );
}