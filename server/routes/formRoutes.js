import { Router } from "express";

import { upload } from "../middleware/upload.js";
import { validateForm } from "../validators/formValidator.js";
import { handleValidationErrors } from "../middleware/errorHandler.js";
import { createFormSubmission } from "../controllers/formController.js";

const router = Router();

/**
 * POST /api/form
 * Order matters:
 *  1. Multer parses multipart body (populates req.file)
 *  2. express-validator validates every field (incl. file presence)
 *  3. handleValidationErrors returns structured 400s if any rule fails
 *  4. controller returns structured 201 success payload
 */
router.post(
  "/",
  upload.single("profileImage"),
  validateForm,
  handleValidationErrors,
  createFormSubmission
);

export default router;

