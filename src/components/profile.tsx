"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import type { Book } from "./book-card";

function monthYear(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function initialsOf(source: string) {
  return (
    source
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "B"
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading, setUser, logout } = useAuth();

  const [statsLoading, setStatsLoading] = useState(true);
  const [booksAdded, setBooksAdded] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userEmail = user?.email ?? "";

  const loadStats = useCallback(async () => {
    if (!userEmail) return;
    try {
      const [booksRes, borrowsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
          {
            credentials: "include",
          }
        ),
      ]);
      if (!booksRes.ok) throw new Error(`HTTP ${booksRes.status}`);
      const books = await booksRes.json();
      if (!borrowsRes.ok) throw new Error(`HTTP ${borrowsRes.status}`);
      const borrows = await borrowsRes.json();

      const list: Book[] = Array.isArray(books) ? books : [];
      setBooksAdded(
        list.filter((b) => (b.addedByEmail || "").toLowerCase() === userEmail.toLowerCase())
          .length
      );
      setBorrowedCount(Array.isArray(borrows) ? borrows.length : 0);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      loadStats();
    }
  }, [userEmail, loadStats]);

  function openEditModal() {
    setEditName(user?.name?.trim() || "");
    setEditLocation(user?.location || "");
    setEditOpen(true);
  }

  async function handleProfileSave() {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName.trim(),
          location: editLocation.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.message || "Could not update your profile. Please try again.");
        return;
      }
      // Context update — puro app e (navbar soho) name/location refresh hobe
      setUser({ ...user, name: editName.trim(), location: editLocation.trim() });
      toast.success("Your profile has been updated!");
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const ok = await logout();
      if (!ok) {
        toast.error("Could not log out right now. Please try again.");
        return;
      }
      toast.success("You have been logged out. See you soon!");
      router.replace("/");
    } catch (err) {
      console.error("Failed to log out:", err);
      toast.error("Could not log out right now. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F1]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17382B] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F1] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#E8E6DE] bg-white px-6 py-12 text-center">
          <h1 className="text-xl font-bold text-[#17382B]">Please log in first</h1>
          <p className="mt-2 text-sm text-gray-600">
            You need a BookNook account to view your profile.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-[#C47451] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a95f40]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F1]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17382B] border-t-transparent" />
      </div>
    );
  }

  const displayName = user.name?.trim() || user.email.split("@")[0];
  const initials = initialsOf(displayName);

  return (
    <div className="min-h-screen bg-[#F5F6F1]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* 1. Profile Header */}
        <section className="mb-8 flex flex-col items-start gap-5 rounded-3xl border border-[#E8E6DE] bg-white p-6 sm:flex-row sm:items-center md:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#17382B] text-xl font-bold text-[#F5F6F1]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[#17382B] sm:text-3xl">{displayName}</h1>
            <span className="mt-2 inline-flex rounded-full bg-[#F0EFE9] px-3 py-1 text-xs font-semibold text-[#17382B]">
              BookNook Member
            </span>
          </div>
          <button
            onClick={openEditModal}
            className="rounded-full bg-[#C47451] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a95f40]"
          >
            Edit Profile
          </button>
        </section>

        {/* 2. Reading Statistics */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-[#17382B]">My Reading Community</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E8E6DE] bg-white p-5">
              <p className="text-3xl font-bold text-[#17382B]">{booksAdded}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Books Added</p>
            </div>
            <div className="rounded-2xl border border-[#E8E6DE] bg-white p-5">
              <p className="text-3xl font-bold text-[#C47451]">{borrowedCount}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Currently Borrowed</p>
            </div>
            <div className="rounded-2xl border border-[#E8E6DE] bg-white p-5">
              {/* NOTE: return korle backend record delete kore — tai historical
                  total ekhoni possible na. Bhobishhyote "returned" flag hole
                  eta real total hobe. */}
              <p className="text-3xl font-bold text-[#17382B]">{borrowedCount}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Books Borrowed</p>
            </div>
          </div>
        </section>

        {/* 3. Personal Information */}
        <section className="mb-8 rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#17382B]">Personal Information</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
              <span className="font-medium text-[#17382B]">Full Name</span>
              <span className="text-right text-gray-600">{displayName}</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
              <span className="font-medium text-[#17382B]">Email</span>
              <span className="text-right text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
              <span className="font-medium text-[#17382B]">Location</span>
              <span className="text-right text-gray-600">{user.location?.trim() || "—"}</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4">
              <span className="font-medium text-[#17382B]">Member Since</span>
              <span className="text-right text-gray-600">{monthYear(user.createdAt)}</span>
            </div>
          </div>
        </section>

        {/* 4. Account Settings */}
        <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#17382B]">Account Settings</h2>
          <div className="mt-4 space-y-3">
            <button
              onClick={openEditModal}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4 text-left transition hover:bg-[#E8E6DE]"
            >
              <span>
                <span className="block font-medium text-[#17382B]">Edit Profile</span>
                <span className="mt-0.5 block text-sm text-gray-500">
                  Update your personal information
                </span>
              </span>
              <span aria-hidden className="text-gray-400">→</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#F5F6F1] p-4 text-left transition hover:bg-[#E8E6DE] disabled:opacity-50"
            >
              <span>
                <span className="block font-medium text-red-600">
                  {loggingOut ? "Signing out..." : "Logout"}
                </span>
                <span className="mt-0.5 block text-sm text-gray-500">
                  Sign out of your account
                </span>
              </span>
              <span aria-hidden className="text-gray-400">→</span>
            </button>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal — browser alert/confirm nei */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setEditOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#17382B]">Edit Profile</h3>
            <p className="mt-1 text-sm text-gray-500">Update your personal information</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E6DE] px-4 py-2.5 text-sm text-[#17382B] focus:border-[#17382B] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E6DE] px-4 py-2.5 text-sm text-[#17382B] focus:border-[#17382B] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <div className="rounded-xl bg-[#F0EFE9] p-3 text-sm font-medium text-[#17382B]">
                  {user.email}
                  <span className="mt-0.5 block text-xs font-normal text-gray-500">
                    Email cannot be changed
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="rounded-full border border-[#E8E6DE] px-5 py-2 text-sm font-semibold text-[#17382B] transition hover:bg-[#F0EFE9] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="rounded-full bg-[#C47451] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#a95f40] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}