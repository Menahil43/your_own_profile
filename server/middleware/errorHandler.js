import multer from "multer";
import fs from "fs";
import { validationResult } from "express-validator";

/**
 * Middleware that runs after express-validator.
 * Returns structured 400 errors and cleans up any partially-uploaded file.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Remove the uploaded file (if any) since the rest of the form is invalid
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

/** 404 fallback */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Central error handler.
 * Converts Multer errors (file too large / invalid type) and any
 * unexpected errors into consistent JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  // Multer error: file too large
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [{ field: "profileImage", message: "Image must be smaller than 2 MB" }],
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
      errors: [{ field: "profileImage", message: err.message }],
    });
  }

  // Custom file-type filter error
  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: [{ field: "profileImage", message: err.message }],
    });
  }

  console.error("[Server Error]", err);
  res.status(500).json({
    success: false,
    message: "Internal server error. Please try again.",
  });
};

