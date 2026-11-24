"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type IconProps = React.SVGProps<SVGSVGElement>;

const FiMail: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const FiKey: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="15" r="5" />
    <path d="m11.5 11.5 9-9M17 6l3 3m-6 0 3 3" />
  </svg>
);
const FiEye: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const FiEyeOff: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.2 3.3-.6" />
  </svg>
);
const FiArrowRight: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
);
const FiArrowLeft: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5m7 7-7-7 7-7" /></svg>
);
const FiBookOpen: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 7v14m0-14C9 4.5 5.5 4 2 5v14c3.5-1 7-.5 10 2m0-14c3-2.5 6.5-3 10-2v14c-3.5-1-7-.5-10 2" /></svg>
);
const FiAlertCircle: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
);
const FiCheckCircle: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>
);
const FiLoader: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m17.1-7.1-2.8 2.8M7.7 16.3l-2.8 2.8m14.2 0-2.8-2.8M7.7 7.7 4.9 4.9" /></svg>
);
const FiX: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>
);
const FcGoogle: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
    <path fill="#1976D2" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z" />
    <path fill="#E53935" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z" />
  </svg>
);
interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const BookNookLogo: React.FC<{ lightText?: boolean }> = ({
  lightText = false,
}) => (
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
    <span
      className={`font-serif text-[28px] sm:text-[30px] font-bold tracking-tight leading-none inline-flex items-baseline ${
        lightText ? "text-[#F6F3EC]" : "text-[#C47451]"
      }`}
    >
      BookNook
    </span>
  </div>
);

export default function BookNookLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState<LoginValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formBannerError, setFormBannerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChange = (field: keyof LoginValues, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "email" || field === "password") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (formBannerError) setFormBannerError(null);
  };

  const validate = (values: LoginValues): LoginErrors => {
    const nextErrors: LoginErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Incorrect password. Must be at least 6 characters.";
    }

    return nextErrors;
  };

  const triggerSuccessToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4000);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormBannerError(null);

  const validationErrors = validate(form);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});
  setIsLoading(true);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setFormBannerError(
        data.message || "Login failed. Please check your credentials."
      );
      return;
    }

    if (!data.user) {
      setFormBannerError("Login response did not contain user information.");
      return;
    }

    // Update global authentication state
    setUser(data.user);

    // Show success notification
    triggerSuccessToast(
      `Signed in successfully! Welcome back, ${data.user.name}.`
    );

    // Redirect to Home
    router.push("/");
  } catch (error) {
    console.error("Login error:", error);
    setFormBannerError(
      "Unable to connect to the server. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

const handleGoogleSignIn = () => {
  setFormBannerError(
    "Google sign-in is not available yet. Please use your email and password."
  );
};

  return (
    <div className="min-h-screen bg-[#f4f2ec] text-[#1c2420] flex flex-col relative">
      {/* Success Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 max-w-sm bg-[#183a2d] text-white px-4 py-3.5 rounded-xl shadow-lg border border-white/15 flex items-start gap-3 animate-fade-in"
        >
          <FiCheckCircle
            className="w-5 h-5 text-[#8fb996] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-xs leading-relaxed flex-1">
            <p className="font-semibold text-white">Sign In Successful</p>
            <p className="text-[#dce5d7] mt-0.5">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-[#b9c2b5] hover:text-white cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Split Screen Layout (50% + 50%) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side — Visual Section (50%) */}
        <section className="relative bg-[#1a221d] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden min-h-110">
          {/* Bookshelf Photograph Background */}
          <Image
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80"
            alt="Warm sunlit wooden library bookshelves"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          {/* Dark Editorial Gradient Overlay for High Readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-[#131915]/80 via-[#151c18]/75 to-[#0f1411]/90"
          />

          {/* Top Bar on Left Visual */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link href="/" aria-label="BookNook Home">
              <BookNookLogo lightText />
            </Link>

            <Link
              href="/all-books"
              className="inline-flex items-center gap-1 hover:scale-105 transition">
              <FiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Return to Library
            </Link>
          </div>

          {/* Center Heading & Description */}
          <div className="relative z-10 my-auto py-12 max-w-lg mx-auto text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#dce5d7] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C47451]" />
              Patron Sanctuary
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-white">
              Welcome Back,{" "}
              <span className="italic text-[#dce5d7]">Reader.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#e0e6dd] leading-relaxed max-w-md mx-auto">
              Your next favorite story is waiting. Continue your reading journey
              with BookNook.
            </p>
          </div>

          {/* Bottom Quote */}
          <blockquote className="relative z-10 max-w-lg mx-auto w-full rounded-xl bg-black/45 border border-white/15 p-4 sm:p-5 backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 w-7 h-7 rounded bg-white/10 text-[#dce5d7] flex items-center justify-center shrink-0">
                <FiBookOpen className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif italic text-sm sm:text-base text-white">
                  &ldquo;A reader lives a thousand lives before he dies.&rdquo;
                </p>
                <p className="mt-1.5 text-[11px] text-[#b9c2b5]">
                  — George R.R. Martin
                </p>
              </div>
            </div>
          </blockquote>
        </section>

        {/* Right Side — Login Form (50%) */}
        <section className="bg-[#f7f5f0] px-4 py-10 sm:px-8 lg:px-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#e6e2d8] p-6 sm:p-8 shadow-xs">
            {/* Heading & Subtitle */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#161c19]">
                Welcome Back
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6b706c]">
                Sign in to continue your reading journey.
              </p>
            </div>

            {/* General Auth Error Banner */}
            {formBannerError && (
              <div
                role="alert"
                className="mt-4 rounded-lg px-3.5 py-2.5 text-xs border bg-[#fdf2f2] border-[#f2c4c4] text-[#9b1c1c] flex items-start gap-2"
              >
                <FiAlertCircle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{formBannerError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57] mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e2dfd5] focus:border-[#183a2d] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57] mb-1.5"
                >
                  Password *
                </label>
                <div className="relative">
                  <FiKey
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e2dfd5] focus:border-[#183a2d] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7f7a] hover:text-[#183a2d] cursor-pointer"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <FiEye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <label className="inline-flex items-center gap-2 text-xs text-[#555b57] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(e) =>
                      handleChange("rememberMe", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#cfd4d0] accent-[#183a2d] cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#183a2d] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button with Loading Spinner */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-[#183a2d] hover:bg-[#122c22] disabled:opacity-75 text-white text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <FiLoader
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#ece8de]" />
              <span className="text-[10px] uppercase tracking-wider text-[#8a908c]">
                OR
              </span>
              <div className="h-px flex-1 bg-[#ece8de]" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-[#faf9f5] disabled:opacity-70 border border-[#e0dcd2] text-xs font-medium text-[#252b27] transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FcGoogle className="w-4 h-4" aria-hidden="true" />
              <span>Continue with Google</span>
            </button>

            {/* Bottom Create Account Link */}
            <p className="mt-6 text-center text-xs text-[#6b706c]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#183a2d] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}