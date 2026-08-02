import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  EditIcon,
  CameraIcon,
  ClockIcon,
  UserCheckIcon,
  CheckCircleIcon,
} from "./Icons.jsx";

/** Format an ISO date string into a friendly, readable date. */
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Format the submittedAt timestamp into a readable "Joined" value. */
const formatSubmittedAt = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * ProfileCard — displays all submitted information in a modern, light-themed
 * card with a soft gradient header, avatar, info rows and an Edit button.
 */
export default function ProfileCard({ profile, onEdit }) {
  const {
    fullName = "",
    email = "",
    phone = "",
    dateOfBirth = "",
    department = "",
    message = "",
    profileImage = "",
    submittedAt = "",
  } = profile || {};

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

  const infoRows = [
    { icon: UserIcon, label: "Full Name", value: fullName },
    { icon: MailIcon, label: "Email", value: email },
    { icon: PhoneIcon, label: "Phone", value: phone },
    { icon: CalendarIcon, label: "Date of Birth", value: formatDate(dateOfBirth) },
    { icon: BriefcaseIcon, label: "Department", value: department },
  ];

  return (
    <div className="animate-slideUp mx-auto w-full max-w-2xl">
      {/* ---------- Card ---------- */}
      <div className="card overflow-hidden transition-shadow duration-300 hover:shadow-cardHover">
        {/* Gradient banner */}
        <div className="relative h-28 bg-gradient-to-r from-primary-600 via-blue-500 to-sky-400 sm:h-32">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_120%,white,transparent_50%),radial-gradient(circle_at_80%_-20%,white,transparent_40%)]" />
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Profile Created
          </div>
        </div>

        {/* Avatar overlapping the banner */}
        <div className="relative px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="-mt-14 flex items-end gap-4 sm:-mt-16 sm:gap-5">
            <div className="group relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary-500 to-blue-400 opacity-80 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${fullName}'s profile picture`}
                  className="relative h-full w-full rounded-3xl border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-primary-500 to-blue-400 text-4xl font-extrabold text-white shadow-lg">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-primary-600 shadow-md">
                <CameraIcon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>

            <div className="min-w-0 pb-1">
              <h2 className="truncate text-xl font-extrabold text-slate-900 sm:text-2xl">
                {fullName || "Your Name"}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-primary-600">
                <BriefcaseIcon className="h-4 w-4" aria-hidden="true" />
                {department || "Department"}
              </p>
            </div>
          </div>

          {/* Stats / chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="profile-chip">
              <UserCheckIcon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
              Member
            </span>
            <span className="profile-chip">
              <ClockIcon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
              Joined {formatSubmittedAt(submittedAt)}
            </span>
          </div>

          {/* Info grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors duration-200 hover:border-primary-100 hover:bg-primary-50/40"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm ring-1 ring-slate-200/70">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors duration-200 hover:border-primary-100 hover:bg-primary-50/40">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <MessageSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
              About Me
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {message || "No bio provided yet."}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onEdit}
              className="btn-primary sm:w-auto"
            >
              <EditIcon className="h-4 w-4" aria-hidden="true" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

