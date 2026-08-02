import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormField from "../components/FormField.jsx";
import FileUpload from "../components/FileUpload.jsx";
import Loader from "../components/Loader.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import PageTransition from "../components/PageTransition.jsx";
import {
  ArrowRightIcon,
  ShieldIcon,
  ZapIcon,
  SmartphoneIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  UserCheckIcon,
  RefreshCwIcon,
} from "../components/Icons.jsx";
import { useFormSubmission } from "../hooks/useFormSubmission.js";

export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Finance",
  "Human Resources",
  "Design",
  "Operations",
];

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/** Normalize a File / FileList / null into a single File or null. */
const getFile = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (typeof FileList !== "undefined" && value instanceof FileList && value.length > 0) {
    return value[0];
  }
  return null;
};

/**
 * Fetch a remote image URL and convert it into a File object so the existing
 * avatar can be re-used when the user edits their profile.
 */
const urlToFile = async (url, name) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch image");
  const blob = await response.blob();
  const ext =
    (url.split(".").pop() || "").split(/[?#]/)[0].toLowerCase() || "jpg";
  const type = blob.type || (ext === "jpg" ? "image/jpeg" : `image/${ext}`);
  const safeName = (name || "profile").replace(/\s+/g, "-");
  return new File([blob], `${safeName}.${ext}`, { type });
};

/**
 * Client-side Zod schema.
 * Mirrors the Express + express-validator rules on the server.
 */
const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d{10,15}$/, "Phone number must contain 10–15 digits only"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00`).getTime()), "Please enter a valid date")
    .refine(
      (v) => new Date(`${v}T23:59:59`).getTime() <= Date.now(),
      "Date of birth cannot be a future date"
    ),

  department: z.string().min(1, "Department is required"),

  profileImage: z
    .custom((value) => getFile(value) !== null, "Profile picture is required")
    .refine(
      (value) => {
        const f = getFile(value);
        return f !== null && ACCEPTED_TYPES.includes(f.type);
      },
      "Only JPG, JPEG, PNG or WebP images are allowed"
    )
    .refine(
      (value) => {
        const f = getFile(value);
        return f !== null && f.size <= MAX_FILE_SIZE;
      },
      "Image must be smaller than 2 MB"
    ),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  department: "",
  profileImage: null,
  message: "",
};

export default function HomePage() {
  const [view, setView] = useState("form"); // "form" | "profile"
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    reValidateMode: "onChange",
  });

  const { submit, submitInProgress, serverErrors, setServerErrors } = useFormSubmission();

  // Smoothly scroll to top whenever the view switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  /** Clear a server-side error as soon as the user fixes that field. */
  const clearServerError = useCallback(
    (field) => {
      setServerErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [setServerErrors]
  );

  /** Register wrapper: keeps RHF onChange + clears server error for the field. */
  const reg = (name, opts = {}, transform) => {
    const { onChange, ...rest } = register(name, opts);
    return {
      ...rest,
      onChange: (e) => {
        if (transform) transform(e);
        onChange?.(e);
        clearServerError(name);
      },
    };
  };

  const fullNameReg = reg("fullName");
  const emailReg = reg("email");
  const phoneReg = reg(
    "phone",
    {},
    (e) => {
      // Digits only, max 15
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 15);
    }
  );
  const dateOfBirthReg = reg("dateOfBirth");
  const departmentReg = reg("department");
  const messageReg = reg("message");

  const onSubmit = async (values) => {
    const result = await submit(values, (data) => {
      setProfile(data);
      setServerErrors({});
    });

    // Only transition to the profile view on a successful submission.
    if (result.ok) {
      setIsEditing(false);
      setView("profile");
    }
  };

  /** Return to the form pre-filled with the current profile's values. */
  const handleEdit = async () => {
    if (!profile) {
      setView("form");
      return;
    }

    setIsEditing(true);
    setServerErrors({});

    reset({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dateOfBirth: (profile.dateOfBirth || "").slice(0, 10),
      department: profile.department || "",
      message: profile.message || "",
      profileImage: null,
    });

    // Re-use the existing avatar so the user isn't forced to re-upload.
    if (profile.profileImage) {
      try {
        const file = await urlToFile(profile.profileImage, profile.fullName || "profile");
        setValue("profileImage", file, { shouldValidate: true, shouldDirty: true });
        trigger("profileImage");
      } catch {
        // Fall through — the uploader stays empty and the user can pick a new image.
      }
    }

    setView("form");
  };

  const fieldError = (name) => errors[name]?.message || serverErrors[name];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* ---------- Header ---------- */}
      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
          <ZapIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Full-Stack · React + Express
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {isEditing ? "Edit your profile" : "Create your profile"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
          {view === "profile"
            ? "Your profile has been created — here's how it looks."
            : "A modern, light-themed registration form with validation on both the client and the server."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <ShieldIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
            Dual validation
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <ZapIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
            Instant feedback
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <SmartphoneIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
            Fully responsive
          </span>
        </div>
      </header>

      {/* ---------- Animated view switch ---------- */}
      <PageTransition viewKey={view}>
        {view === "profile" ? (
          /* ================= PROFILE VIEW ================= */
          <div>
            {/* "Your Own Profile" section header */}
            <div className="mb-6 flex items-center justify-center gap-2 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm ring-1 ring-blue-100">
                <UserCheckIcon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                Your Own Profile
              </span>
            </div>

            <ProfileCard profile={profile} onEdit={handleEdit} />

            <div className="mt-6 text-center">
              <button type="button" onClick={handleEdit} className="btn-ghost">
                <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          /* ================= FORM VIEW ================= */
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="card animate-fadeInUp p-6 sm:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="e.g. Sarah Ahmed"
                icon={UserIcon}
                error={fieldError("fullName")}
                registration={fullNameReg}
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                icon={MailIcon}
                error={fieldError("email")}
                registration={emailReg}
              />

              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="e.g. 1234567890"
                icon={PhoneIcon}
                error={fieldError("phone")}
                registration={phoneReg}
                hint="10–15 digits, no spaces or symbols"
              />

              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                placeholder="Select your date of birth"
                icon={CalendarIcon}
                error={fieldError("dateOfBirth")}
                registration={dateOfBirthReg}
              />

              <FormField
                label="Department"
                name="department"
                type="select"
                icon={BriefcaseIcon}
                error={fieldError("department")}
                registration={departmentReg}
                options={DEPARTMENTS}
              />
            </div>

            {/* ---------- Profile picture (full width) ---------- */}
            <div className="mt-6">
              <FileUpload
                name="profileImage"
                label="Profile Picture"
                error={fieldError("profileImage")}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                clearServerError={() => clearServerError("profileImage")}
              />
            </div>

            {/* ---------- Message ---------- */}
            <div className="mt-6">
              <FormField
                label="Message"
                name="message"
                type="textarea"
                placeholder="Tell us a little about yourself (min. 10 characters)..."
                icon={MessageSquareIcon}
                error={fieldError("message")}
                registration={messageReg}
              />
            </div>

            {/* ---------- Submit ---------- */}
            <div className="mt-8">
              <button type="submit" className="btn-primary" disabled={submitInProgress}>
                {submitInProgress ? (
                  <Loader label="Submitting..." />
                ) : (
                  <>
                    <span>{isEditing ? "Update Profile" : "Submit Registration"}</span>
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                By submitting, you agree to our terms. All fields marked with{" "}
                <span className="text-red-500">*</span> are required.
              </p>
            </div>
          </form>
        )}
      </PageTransition>

      <footer className="mt-8 text-center text-xs text-slate-400">
        Built with React, Express, Tailwind CSS &amp; Zod — light theme everywhere.
      </footer>
    </div>
  );
}

