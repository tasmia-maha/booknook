
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Menu, X } from "lucide-react";

// Logo
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

    <span className="font-serif text-[28px] sm:text-[30px] font-bold tracking-tight text-[#17382B] leading-none inline-flex items-baseline">
      BookNook
    </span>
  </div>
);

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  // Generate user initials
  const userInitials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logout handler
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/", isPrivate: false },
    { name: "All Books", path: "/all-books", isPrivate: false },
    { name: "Add Book", path: "/add-book", isPrivate: true },
    { name: "My Books", path: "/my-books", isPrivate: true },
    { name: "My Borrows", path: "/my-borrows", isPrivate: true },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.isPrivate || Boolean(user)
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F6F1]/95 backdrop-blur-sm border-b border-[#E5E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left side */}
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="focus:outline-none hover:opacity-95 transition-opacity"
              aria-label="BookNook Home"
            >
              <BookNookLogo />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#17382B] font-semibold"
                        : "text-[#5C6660] hover:text-[#17382B]"
                    }`}
                  >
                    {link.name}

                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C47451] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? null : !user ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#5C6660] hover:text-[#17382B] px-3 py-2 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="text-sm font-medium bg-[#17382B] hover:bg-[#0E2B1F] text-white px-5 py-2.5 rounded-md transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none rounded-full p-0.5 border-2 border-transparent hover:border-[#C47451] transition-all"
                  title={user.name}
                >
                  <div className="w-10 h-10 rounded-full bg-[#17382B] text-white flex items-center justify-center text-sm font-medium">
                    {userInitials}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-[#E5E3DC] py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-[#E5E3DC]">
                      <p className="text-sm font-semibold text-[#17382B] truncate">
                        {user.name}
                      </p>

                      <p className="text-xs text-[#6E7771] truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#3E4742] hover:bg-[#F5F6F1] hover:text-[#17382B] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#6E7771]" />
                        My Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#C47451] hover:bg-[#FDF6F4] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-[#17382B] hover:bg-[#E5E3DC]/50 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#F5F6F1] border-b border-[#E5E3DC] px-4 pt-2 pb-5 space-y-2">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.path
                  ? "bg-[#E3EAE3] text-[#17382B] font-semibold"
                  : "text-[#5C6660] hover:bg-[#E5E3DC]/40"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-[#E5E3DC]">
            {loading ? null : !user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-[#17382B] border border-[#17382B] rounded-md"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium bg-[#17382B] text-white rounded-md"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-[#17382B] text-white flex items-center justify-center text-sm font-medium shrink-0">
                      {userInitials}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#17382B]">
                        {user.name}
                      </p>

                      <p className="text-xs text-[#6E7771]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3E4742] hover:bg-[#E5E3DC]/40 rounded-md"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#C47451] hover:bg-[#FDF6F4] rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
