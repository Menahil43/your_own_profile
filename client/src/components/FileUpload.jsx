import { useEffect, useRef, useState } from "react";
import {
  UploadCloudIcon,
  ImageIcon,
  XIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "./Icons.jsx";

export const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPT_ATTR = "image/jpeg,image/jpg,image/png,image/webp";

/**
 * Drag-and-drop image uploader with live preview.
 * Controlled through React Hook Form via `setValue` + `watch`.
 */
export default function FileUpload({
  name,
  label,
  error,
  setValue,
  watch,
  trigger,
  clearServerError,
  required = true,
}) {
  const file = watch(name);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef(null);

  // Build a live preview from the selected File
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl("");
  }, [file]);

  const handleFiles = (fileList) => {
    const selected = fileList?.[0];
    if (!selected) return;

    setValue(name, selected, { shouldValidate: true, shouldDirty: true });
    trigger(name);
    clearServerError(name);

    // Reset the input value so picking the same file again still fires onChange
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = () => {
    setValue(name, null, { shouldValidate: true, shouldDirty: true });
    trigger(name);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </span>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload profile picture"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 sm:p-8 ${
          dragActive
            ? "border-primary-600 bg-primary-50 ring-4 ring-primary-100"
            : error
            ? "border-red-300 bg-red-50/40 hover:border-red-400"
            : "border-slate-200 bg-slate-50/60 hover:border-primary-400 hover:bg-primary-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={ACCEPT_ATTR}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-28 w-28 rounded-2xl object-cover shadow-md ring-2 ring-white"
            />
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <CheckCircleIcon className="h-4 w-4 text-green-500" aria-hidden="true" />
              {file?.name}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round(file.size / 1024)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Remove image
            </button>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-blue-500 text-white shadow-lg shadow-blue-600/25">
              <UploadCloudIcon className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                <span className="text-primary-600 underline underline-offset-2">
                  Click to upload
                </span>{" "}
                or drag &amp; drop
              </p>
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                JPG, JPEG, PNG or WebP — max 2 MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="error-text" role="alert">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

