"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F7F6F2] py-14 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* left side */}
          <div className="lg:col-span-6 space-y-7">
            {/* Eyebrow Subtitle */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#A65336]" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7B847E]">
                A Quiet Literary Sanctuary
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.12] tracking-tight text-[#133A2A] font-medium">
              Every book opens <br />
              <span className="italic font-normal text-[#A65336]">
                a new world.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#5C6660] max-w-lg leading-relaxed">
              Step into our carefully curated stories. Discover rare editions,
              memorable essays, and forgotten adventures collected for curious,
              wandering minds.
            </p>

            {/* Action Button */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                href="/all-books"
                className="inline-flex items-center gap-2.5 bg-[#133A2A] hover:bg-[#0E2B1F] text-white text-sm font-medium px-6 py-3.5 rounded-md transition-all shadow-sm group"
              >
                Explore the library
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* right side */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-[#E5E3DC] bg-[#E8E6DF]">
              <Image
                src="/screen.png"
                alt="BookNook Hero Illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;