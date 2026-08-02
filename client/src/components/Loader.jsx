import { LoaderIcon } from "./Icons.jsx";

/** Inline loading spinner used on the submit button. */
export default function Loader({ label = "Submitting..." }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

