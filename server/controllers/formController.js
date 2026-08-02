/**
 * Controller for form submissions.
 * Only runs after Multer + express-validator have passed, so the
 * payload here is guaranteed to be valid and the file is stored.
 */
export const createFormSubmission = (req, res) => {
  const { fullName, email, phone, dateOfBirth, department, message } = req.body;

  const profileImageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  res.status(201).json({
    success: true,
    message: "Form submitted successfully!",
    data: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fullName,
      email,
      phone,
      dateOfBirth,
      department,
      message,
      profileImage: profileImageUrl,
      submittedAt: new Date().toISOString(),
    },
  });
};

