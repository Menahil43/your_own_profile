import { body } from "express-validator";

/** Allowed department options — must match the client dropdown. */
export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Finance",
  "Human Resources",
  "Design",
  "Operations",
];

/**
 * Server-side validation rules.
 * Mirrors the client-side Zod schema so the API is equally strict.
 */
export const validateForm = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10,15}$/)
    .withMessage("Phone number must contain 10–15 digits only"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Please enter a valid date")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date of birth cannot be a future date");
      }
      return true;
    }),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isIn(DEPARTMENTS)
    .withMessage("Please select a valid department"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),

  // File presence is validated against req.file (populated by Multer)
  body("profileImage").custom((_, { req }) => {
    if (!req.file) {
      throw new Error("Profile picture is required");
    }
    return true;
  }),
];

