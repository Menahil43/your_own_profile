import { useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api.js";

/**
 * Manages the async form submission lifecycle:
 *  - submitInProgress flag (disables the button, shows spinner)
 *  - duplicate-submit prevention via a ref guard
 *  - server validation errors mapped to { field -> message }
 *  - success toast (green) / error toast (red)
 */
export function useFormSubmission() {
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const inFlight = useRef(false);

  const submit = async (values, onSuccess) => {
    // Prevent duplicate submissions while a request is in flight
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitInProgress(true);
    setServerErrors({});

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof FileList) {
        if (value.length > 0) formData.append(key, value[0]);
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      const response = await api.post("/form", formData);

      if (response.data?.success) {
        const payload = response.data.data || {};
        toast.success(response.data.message || "Form submitted successfully!", {
          id: "form-success",
        });
        onSuccess?.(payload);
        return { ok: true, data: payload };
      }

      toast.error("Something went wrong. Please try again.", { id: "form-error" });
      return { ok: false };
    } catch (error) {
      const serverError = error?.response?.data;

      if (serverError?.errors?.length) {
        // Map { field, message }[] to { field: message } for display under inputs
        const mapped = {};
        serverError.errors.forEach(({ field, message }) => {
          if (field && message) mapped[field] = message;
        });
        setServerErrors(mapped);

        toast.error(
          serverError.message || "Please fix the highlighted fields.",
          { id: "form-error" }
        );
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error — is the server running?", { id: "form-error" });
      } else {
        toast.error("Something went wrong. Please try again.", { id: "form-error" });
      }

      return { ok: false, errors: serverError?.errors || [] };
    } finally {
      inFlight.current = false;
      setSubmitInProgress(false);
    }
  };

  return { submit, submitInProgress, serverErrors, setServerErrors };
}

