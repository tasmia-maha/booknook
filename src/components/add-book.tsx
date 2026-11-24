"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const BENEFITS = [
  { title: "Share Knowledge", desc: "Pass on the books that taught you something valuable." },
  { title: "Inspire Readers", desc: "Your shelf might hold someone's next favourite read." },
  { title: "Build Community", desc: "Every contribution makes the library richer for everyone." },
];

interface FormState {
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: string;
  addedByName: string;
  addedByEmail: string;
}

const emptyForm: FormState = {
  title: "",
  author: "",
  category: "",
  description: "",
  totalCopies: "1",
  addedByName: "",
  addedByEmail: "",
};

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const inputClass =
  "w-full rounded-xl border border-[#E8E6DE] bg-white px-4 py-2.5 text-sm text-[#17382B] outline-none transition focus:border-[#C47451] focus:ring-2 focus:ring-[#C47451]/20";
const labelClass = "mb-1.5 block text-sm font-medium text-[#17382B]";

export default function AddBook() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update =
    (field: keyof FormState) => (e: ChangeEvent<InputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    uploadImage(file);
  }

  async function uploadImage(file: File) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Image upload key missing (NEXT_PUBLIC_IMGBB_API_KEY in .env.local)");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error?.message || "Upload failed");
      setImageUrl(data.data.url);
      toast.success("Cover image uploaded!");
    } catch (err) {
      console.error("Image upload failed:", err);
      removeImage();
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.category || !form.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const copies = Number(form.totalCopies);
    if (!Number.isInteger(copies) || copies < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }
    if (uploading) {
      toast.error("Cover image is still uploading — please wait a moment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          category: form.category,
          description: form.description.trim(),
          totalCopies: copies,
          image: imageUrl,
          addedByName: form.addedByName.trim() || "Anonymous",
          addedByEmail: form.addedByEmail.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Failed to add book");

      toast.success("Your book has been successfully added to the BookNook library!");
      setForm(emptyForm);
      removeImage();
      setTimeout(() => router.push("/all-books"), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#17382B] md:text-4xl">Add a New Book</h1>
        <p className="mt-2 text-gray-500">Share a great read with the community.</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* LEFT — editorial panel */}
        <aside className="flex flex-col justify-between gap-10 rounded-3xl bg-[#17382B] p-8 text-[#F5F6F1] md:p-10">
          <div>
            <h2 className="text-2xl font-bold leading-snug md:text-3xl">
              Share a Story, Inspire a Reader.
            </h2>
            <p className="mt-4 leading-relaxed text-[#F5F6F1]/70">
              Every book holds a story worth sharing. Contribute your favorite books and help
              someone discover their next great read.
            </p>

            <ul className="mt-8 space-y-5">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#C47451]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="mt-0.5 text-sm text-[#F5F6F1]/60">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#F5F6F1]/10 p-5">
            <p className="text-lg italic text-[#C47451]">“Books are meant to be shared.”</p>
          </div>
        </aside>

        {/* RIGHT — form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section A — Basic info */}
          <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#17382B]">Basic Book Information</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Book Title *</label>
                <input className={inputClass} value={form.title} onChange={update("title")} placeholder="e.g. The Alchemist" />
              </div>
              <div>
                <label className={labelClass}>Author Name *</label>
                <input className={inputClass} value={form.author} onChange={update("author")} placeholder="e.g. Paulo Coelho" />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Category *</label>
              <select className={inputClass} value={form.category} onChange={update("category")}>
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Description *</label>
              <textarea rows={4} className={inputClass} value={form.description} onChange={update("description")} placeholder="What is this book about? Why would someone love it?" />
            </div>
          </section>

          {/* Section B — Book cover */}
          <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#17382B]">Book Cover</h3>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />

            {!imagePreview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${dragActive ? "border-[#C47451] bg-[#C47451]/5" : "border-[#E8E6DE] hover:border-[#C47451]"}`}
              >
                <svg className="h-8 w-8 text-[#C47451]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                <p className="mt-3 text-sm font-medium text-[#17382B]">Drag & drop your cover here</p>
                <p className="mt-1 text-xs text-gray-500">
                  or <span className="font-medium text-[#C47451]">Browse files</span> — JPG, PNG, WEBP (max {MAX_SIZE_MB}MB)
                </p>
              </div>
            ) : (
              <div className="relative mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Cover preview" className="h-56 w-full rounded-2xl object-cover" />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-sm font-medium text-white">
                    Uploading...
                  </div>
                )}
                <button type="button" onClick={removeImage} className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-white">
                  Remove
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  {uploading ? "Uploading image..." : imageUrl ? "Image uploaded and ready." : ""}
                </p>
              </div>
            )}
          </section>

          {/* Section C — Inventory */}
          <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#17382B]">Book Inventory</h3>
            <div className="mt-5">
              <label className={labelClass}>How many copies are you contributing?</label>
              <input type="number" min={1} className={inputClass} value={form.totalCopies} onChange={update("totalCopies")} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#F5F6F1] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Copies</p>
                <p className="mt-1 text-lg font-semibold text-[#17382B]">{Number(form.totalCopies) || 0}</p>
              </div>
              <div className="rounded-2xl bg-[#F5F6F1] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Available Copies</p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">{Number(form.totalCopies) || 0}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">All copies are initially available for borrowing.</p>
          </section>

          {/* Section D — Contributor */}
          <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#17382B]">Contributor Information</h3>
            {/* TODO: auth banano hole ei duita field logged-in user theke
                auto-populate hobe ar readOnly kore dibo */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Contributor Name</label>
                <input className={inputClass} value={form.addedByName} onChange={update("addedByName")} placeholder="Your name" />
              </div>
              <div>
                <label className={labelClass}>Contributor Email</label>
                <input type="email" className={inputClass} value={form.addedByEmail} onChange={update("addedByEmail")} placeholder="you@example.com" />
              </div>
            </div>
          </section>

          {/* Section E — Submit */}
          <section className="rounded-3xl border border-[#E8E6DE] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#17382B]">Ready to Share Your Book?</h3>
            <p className="mt-1 text-sm text-gray-500">Your contribution will help another reader discover a new story.</p>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="mt-4 w-full rounded-xl bg-[#C47451] px-6 py-3 font-semibold text-white transition hover:bg-[#a95f42] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {submitting ? "Adding Book..." : "Add Book to Library"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">Your book will be added to the BookNook collection.</p>
          </section>
        </form>
      </div>
    </main>
  );
}