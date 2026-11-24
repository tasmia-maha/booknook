"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const iconContent: Record<string, React.ReactNode> = {
  User: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  Mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  Image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  Key: <><circle cx="8" cy="15" r="5" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" /></>,
  Shield: <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />,
  Eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  EyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3-.5" /></>,
  Lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  BookOpen: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  ArrowRight: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  ArrowLeft: <><path d="M19 12H5m7 7-7-7 7-7" /></>,
  Check: <path d="m5 12 4 4L19 6" />,
  MessageSquare: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></>,
  AlertCircle: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></>,
  CheckCircle: <><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m22 4-10 10-3-3" /></>,
  Loader: <><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" /></>,
};

const createIcon = (name: keyof typeof iconContent) => {
  const Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {iconContent[name]}
    </svg>
  );
  Icon.displayName = `Icon${name}`;
  return Icon;
};

const FiUser = createIcon("User");
const FiMail = createIcon("Mail");
const FiImage = createIcon("Image");
const FiKey = createIcon("Key");
const FiShield = createIcon("Shield");
const FiEye = createIcon("Eye");
const FiEyeOff = createIcon("EyeOff");
const FiLock = createIcon("Lock");
const FiBookOpen = createIcon("BookOpen");
const FiArrowRight = createIcon("ArrowRight");
const FiArrowLeft = createIcon("ArrowLeft");
const FiCheck = createIcon("Check");
const FiMessageSquare = createIcon("MessageSquare");
const FiAlertCircle = createIcon("AlertCircle");
const FiCheckCircle = createIcon("CheckCircle");
const FiLoader = createIcon("Loader");

const FcGoogle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-4V7.4H3a10 10 0 0 0 0 9.2z" />
    <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9 5.4l3.4 2.6c.8-2.3 3-4.1 5.6-4.1z" />
  </svg>
);

type SimulatorState =
  | "default"
  | "validation-error"
  | "password-mismatch"
  | "signing-up"
  | "success";

interface FormValues {
  fullName: string;
  email: string;
  avatarUrl: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  password?: string;
  confirmPassword?: string;
  agreed?: string;
}

const EMPTY_FORM_VALUES: FormValues = {
  fullName: "",
  email: "",
  avatarUrl: "",
  password: "",
  confirmPassword: "",
  agreed: false,
};

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

export default function BookNookRegisterPage() {
  const router = useRouter();
  const [simulator, setSimulator] = useState<SimulatorState>("default");
  const [form, setForm] = useState<FormValues>(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const passkeyChecks = useMemo(() => {
    return {
      hasUpper: /[A-Z]/.test(form.password),
      hasLower: /[a-z]/.test(form.password),
      hasMinLength: form.password.length >= 8,
    };
  }, [form.password]);

  const validateForm = (values: FormValues): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (values.avatarUrl.trim()) {
      try {
        new URL(values.avatarUrl.trim());
      } catch {
        nextErrors.avatarUrl = "Please enter a valid URL (starting with http:// or https://).";
      }
    }

    if (!values.password) {
      nextErrors.password = "Please create a passkey.";
    } else if (
      !/[A-Z]/.test(values.password) ||
      !/[a-z]/.test(values.password) ||
      values.password.length < 8
    ) {
      nextErrors.password = "Passkey must meet all requirements below.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your passkey.";
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!values.agreed) {
      nextErrors.agreed = "You must agree to the Ex-Libris Protocol to continue.";
    }

    return nextErrors;
  };

  const handleChange = (field: keyof FormValues, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      if (field === "password" && updated.confirmPassword) {
        delete updated.confirmPassword;
      }
      return updated;
    });

    if (statusMessage && simulator !== "signing-up") {
      setStatusMessage(null);
      if (simulator !== "default") {
        setSimulator("default");
      }
    }
  };

  const applySimulatorPreset = (mode: SimulatorState) => {
    setSimulator(mode);

    if (mode === "default") {
      setErrors({});
      setStatusMessage(null);
      return;
    }

    if (mode === "validation-error") {
      setErrors({
        fullName: form.fullName.trim() ? undefined : "Full name is required.",
        email: form.email.trim() ? undefined : "Email address is required.",
        password:
          passkeyChecks.hasUpper &&
          passkeyChecks.hasLower &&
          passkeyChecks.hasMinLength
            ? undefined
            : "Please satisfy all passkey requirements.",
        agreed: form.agreed
          ? undefined
          : "Please accept the Ex-Libris Protocol.",
      });
      setStatusMessage(
        "Please review the highlighted fields before creating your account."
      );
      return;
    }

    if (mode === "password-mismatch") {
      setErrors({
        confirmPassword: "Confirm password does not match your password.",
      });
      setStatusMessage(
        "Password mismatch detected. Make sure both password fields match."
      );
      return;
    }

    if (mode === "signing-up") {
      setErrors({});
      setStatusMessage("Setting up your BookNook patron account...");
      return;
    }

    if (mode === "success") {
      setErrors({});
      setStatusMessage(
        `Welcome${form.fullName.trim() ? `, ${form.fullName.trim()}` : ""}! Your BookNook account is ready.`
      );
    }
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 1. Validate form
  const foundErrors = validateForm(form);

  if (Object.keys(foundErrors).length > 0) {
    setErrors(foundErrors);

    if (foundErrors.confirmPassword === "Passwords do not match.") {
      setSimulator("password-mismatch");
      setStatusMessage("Password and Confirm Password do not match.");
    } else {
      setSimulator("validation-error");
      setStatusMessage("Please fix the highlighted fields and try again.");
    }

    return;
  }

  // 2. Start loading
  setErrors({});
  setSimulator("signing-up");
  setStatusMessage("Creating your BookNook account...");

  try {
    // 3. Send registration data to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      }
    );

    // 4. Get backend response
    const data = await response.json();

    // 5. Handle errors
    if (!response.ok) {
      setSimulator("default");
      setStatusMessage(data.message || "Registration failed.");
      return;
    }

    // 6. Registration successful
    setSimulator("success");
    setStatusMessage(
      `Account created successfully for ${form.fullName.trim()}!`
    );

    // 7. Redirect to login page
    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (error) {
    console.error("Registration error:", error);

    setSimulator("default");
    setStatusMessage(
      "Unable to connect to server. Please try again."
    );
  }
};


  const isLoading = simulator === "signing-up";
  const isSuccess = simulator === "success";
  const isErrorState =
    simulator === "validation-error" || simulator === "password-mismatch";

  return (
    <div className="min-h-screen bg-[#f4f2ec] text-[#1c2420] flex flex-col">
      {/* Top Bar */}
      <header className="min-h-14 bg-white border-b border-[#e4e0d6] px-4 lg:px-6 py-2 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <BookNookLogo />
          <span className="text-[#7a7f7a] italic hidden sm:inline truncate border-l border-[#e4e0d6] pl-3">
            Reading Conservatory
          </span>
        </div>

        {/* Simulator Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] uppercase tracking-wider text-[#7a7f7a] font-medium mr-1 shrink-0">
            Simulator:
          </span>

          {(
            [
              { id: "default", label: "Default" },
              { id: "validation-error", label: "Validation Error" },
              { id: "password-mismatch", label: "Password Mismatch" },
              { id: "signing-up", label: "Signing Up..." },
              { id: "success", label: "Success" },
            ] as const
          ).map((item) => {
            const active = simulator === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => applySimulatorPreset(item.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#183a2d] text-white"
                    : "bg-[#f3f1eb] text-[#4c524e] hover:bg-[#e8e4da]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Navigation Links */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-[#5c625e] shrink-0">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-1 hover:text-[#183a2d] transition">
            <FiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Return to Library
          </Link>
          <span className="text-[#d3cfc4]">|</span>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Panel */}
        <section className="lg:col-span-6 relative bg-[#1a221d] text-white p-6 sm:p-10 flex flex-col justify-between overflow-hidden min-h-115">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-br from-[#2b3528]/85 via-[#1c241e]/80 to-[#111613]/95"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_25%,#a7b89e_0%,transparent_55%)]"
          />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#d6dcd2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8fb996]" />
              Patron Archives &amp; Sanctuary
            </span>

            <span className="px-3 py-1 rounded-full text-[11px] bg-black/45 border border-white/15 text-[#e6ebe4]">
              Curated Community Collection
            </span>
          </div>

          {/* Center Editorial Copy & Quote */}
          <div className="relative z-10 my-auto mx-auto text-center flex flex-col items-center max-w-lg">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-white">
              Join Our Reading{" "}
              <span className="italic text-[#dce5d7]">Community.</span>
            </h1>

            <p className="mt-4 text-sm mx-auto sm:text-base text-[#d5dcd2] leading-relaxed max-w-md">
              Discover beautiful stories, share your favorite books, and become
              part of a community that loves reading.
            </p>

            <blockquote className="mt-7 w-full text-left rounded-xl bg-black/45 border border-white/15 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-7 h-7 rounded bg-white/10 text-[#dce5d7] flex items-center justify-center shrink-0">
                  <FiBookOpen className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="font-serif italic text-sm sm:text-base text-white">
                    &ldquo;A library is not a luxury but one of the necessities of
                    life.&rdquo;
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#aeb7aa]">
                    <span>— Henry Ward Beecher</span>
                    <span className="italic">Conservatory Inscription No. 88</span>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="lg:col-span-6 bg-[#f7f5f0] px-4 py-8 sm:px-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#e6e2d8] p-6 sm:p-8">
            {/* Portal Header */}
            <div className="flex items-center justify-between gap-3 pb-5 border-b border-[#efece4]">
              <div>
                <h2 className="font-serif text-base font-semibold text-[#183a2d] leading-tight">
                  BookNook
                </h2>
                <p className="text-[11px] text-[#7a7f7a]">
                  Patron Member Portal
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#f4f6f5] text-[#49544e] border border-[#e2e7e4]">
                <FiLock className="w-3.5 h-3.5 text-[#183a2d]" aria-hidden="true" />
                <span>256-Bit Encrypted</span>
              </span>
            </div>

            {/* Form Title */}
            <div className="mt-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#161c19]">
                Create Your Account
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#6b706c]">
                Start your reading journey with BookNook.
              </p>
            </div>

            {/* Simulator / Status Banner */}
            {statusMessage && (
              <div
                role="alert"
                className={`mt-4 rounded-lg px-3.5 py-2.5 text-xs border flex items-start gap-2 ${
                  isSuccess
                    ? "bg-[#edf7f0] border-[#b7dfc4] text-[#17532b]"
                    : isLoading
                    ? "bg-[#f3f5f4] border-[#d7deda] text-[#2c3b34]"
                    : "bg-[#fdf2f2] border-[#f2c4c4] text-[#9b1c1c]"
                }`}
              >
                {isSuccess ? (
                  <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                ) : isLoading ? (
                  <FiLoader className="w-4 h-4 shrink-0 mt-0.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              {/* Patron Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57] mb-1.5"
                >
                  Patron Full Name *
                </label>
                <div className="relative">
                  <FiUser
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.fullName || (isErrorState && !form.fullName.trim())
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e2dfd5] focus:border-[#183a2d] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Patron Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57]"
                  >
                    Patron Email *
                  </label>
                  <span className="text-[10px] text-[#8a908c]">
                    For courier notices
                  </span>
                </div>
                <div className="relative">
                  <FiMail
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.email || (isErrorState && !form.email.trim())
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

              {/* Avatar / Bookplate Image URL */}
              <div>
                <label
                  htmlFor="avatarUrl"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57] mb-1.5"
                >
                  Avatar / Bookplate Image URL{" "}
                  <span className="text-[#999e9a] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FiImage
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="avatarUrl"
                    type="url"
                    value={form.avatarUrl}
                    onChange={(e) => handleChange("avatarUrl", e.target.value)}
                    placeholder="Paste an image link (optional)"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.avatarUrl
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e2dfd5] focus:border-[#183a2d] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.avatarUrl && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.avatarUrl}
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
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Create a password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.password || simulator === "password-mismatch"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-[#555b57] mb-1.5"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiShield
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a908c]"
                    aria-hidden="true"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    placeholder="Re-enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-[#faf9f6] border outline-none transition ${
                      errors.confirmPassword ||
                      simulator === "password-mismatch"
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#e2dfd5] focus:border-[#183a2d] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7f7a] hover:text-[#183a2d] cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <FiEye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Passkey Requirements Box */}
              <div className="rounded-xl bg-[#f8f7f3] border border-[#ebe7dc] p-3.5 text-[11px] text-[#5c625e]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7470] mb-2">
                  Patron Passkey Requirements:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <FiCheck
                      className={`w-3.5 h-3.5 shrink-0 ${
                        passkeyChecks.hasUpper
                          ? "text-[#1e7e46]"
                          : "text-[#9ca39e]"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        passkeyChecks.hasUpper
                          ? "text-[#17532b] font-medium"
                          : ""
                      }
                    >
                      At least one uppercase letter (A-Z)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck
                      className={`w-3.5 h-3.5 shrink-0 ${
                        passkeyChecks.hasLower
                          ? "text-[#1e7e46]"
                          : "text-[#9ca39e]"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        passkeyChecks.hasLower
                          ? "text-[#17532b] font-medium"
                          : ""
                      }
                    >
                      At least one lowercase letter (a-z)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck
                      className={`w-3.5 h-3.5 shrink-0 ${
                        passkeyChecks.hasMinLength
                          ? "text-[#1e7e46]"
                          : "text-[#9ca39e]"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        passkeyChecks.hasMinLength
                          ? "text-[#17532b] font-medium"
                          : ""
                      }
                    >
                      Minimum 8 characters
                    </span>
                  </li>
                </ul>
              </div>

              {/* Agreement Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 text-xs text-[#555b57] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(e) => handleChange("agreed", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#cfd4d0] accent-[#183a2d] cursor-pointer"
                  />
                  <span>
                    I agree to honor the Conservatory{" "}
                    <a
                      href="#protocol"
                      className="underline font-medium text-[#183a2d]"
                    >
                      Ex-Libris Protocol
                    </a>{" "}
                    and Community Care Rules for shared folios.
                  </span>
                </label>
                {errors.agreed && (
                  <p className="mt-1 text-[11px] text-[#b42318]">
                    {errors.agreed}
                  </p>
                )}
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-[#183a2d] hover:bg-[#122c22] disabled:opacity-70 text-white text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isLoading ? "Creating Account..." : "Create Patron Account"}
                </span>
                <FiArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>

            {/* Divider & Google Sign-in */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#ece8de]" />
              <span className="text-[10px] uppercase tracking-wider text-[#8a908c]">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-[#ece8de]" />
            </div>

            <button
              type="button"
              onClick={() => applySimulatorPreset("success")}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-[#faf9f5] border border-[#e0dcd2] text-xs font-medium text-[#252b27] transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FcGoogle className="w-4 h-4" aria-hidden="true" />
              <span>Continue with Google</span>
            </button>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2 text-[11px] text-[#6b706c]">
              <p>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-[#183a2d] hover:underline"
                >
                  Log in
                </a>
              </p>
              <p className="text-[10px] text-[#8a908c] leading-relaxed">
                By signing in or registering, you agree to our{" "}
                <a href="#protocol" className="underline">
                  Ex-Libris Protocol
                </a>{" "}
                &amp;{" "}
                <a href="#privacy" className="underline">
                  Patron Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Bottom Concierge Note */}
          <p className="mt-5 text-[11px] text-[#6b706c] flex items-center gap-1.5">
            <FiMessageSquare className="w-3.5 h-3.5 text-[#5c625e]" aria-hidden="true" />
            <span>Need assistance?</span>
            <a
              href="#concierge"
              className="underline font-medium text-[#3f4642] hover:text-[#183a2d]"
            >
              Contact Archival Concierge
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}