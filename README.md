# 📋 Your Own Profile — Interactive Profile Generator

A polished, **light-themed**, fully responsive full-stack application that transforms a registration form into an interactive **"Your Own Profile"** experience. After submitting the form, users are shown a beautifully animated profile card built from their input — just like creating a social media profile.

## ✨ Features

### 👤 Profile Generation
- After a successful submission, the form is **not** simply cleared — a beautifully designed **Profile Card** is generated instead
- Displays: **Profile Picture**, **Full Name**, **Email Address**, **Phone Number**, **Date of Birth**, **Department/Profession**, and **Message/Bio**
- The uploaded image becomes the profile avatar
- Smooth fade-in / slide-up animation on the profile card

### ⏳ Enhanced Submission Experience
- Submit button disables immediately and shows a loading spinner + **"Submitting..."**
- Duplicate-submit prevention while a request is in flight
- Green success toast, then automatic transition to the profile view
- Red error toast / banner on failure — the form stays visible

### ✏️ Edit Profile
- **"Edit Profile"** button on the generated profile card
- Returns the user to the form with **every field pre-filled** (including the existing avatar, re-fetched into the uploader)
- Update any field and submit again to regenerate the profile

### 🎨 Interactive UI
- Smooth page transitions between the form and profile views
- Subtle hover effects on buttons and cards
- Modern card with rounded corners, soft shadows, and a clean light theme
- "Your Own Profile" header above the generated card
- Fully responsive across desktop, tablet, and mobile

### 🛡️ Validation & Reliability
- Field-specific **client-side** validation (React Hook Form + Zod)
- Field-specific **server-side** validation (Express + express-validator)
- Drag-and-drop image upload (JPG / JPEG / PNG / WebP, max 2 MB) with live preview
- Server error messages mapped back to the matching inputs

## 🧰 Tech Stack

| Layer    | Tools                                                                           |
| -------- | ------------------------------------------------------------------------------- |
| Frontend | React 18 (Vite), Tailwind CSS, React Hook Form + Zod, Axios, React Toastify      |
| Backend  | Node.js, Express, Multer, express-validator                                     |

## 🚀 Quick Start

### 1) Backend

```bash
cd server
npm install
npm run dev        # http://localhost:5000
```

### 2) Frontend

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra CORS configuration is needed in development. If port 5173 is busy, Vite will automatically pick the next available port (e.g. 5174).

## 🔄 How It Works

1. **Fill out the form** — name, email, phone, date of birth, department, profile picture, and a short bio.
2. **Submit** — the button shows a spinner and is disabled until the request completes.
3. **Success** — a green toast appears and the view smoothly transitions to the **"Your Own Profile"** card.
4. **Edit** — click **Edit Profile** to jump back to the form with all values pre-filled, tweak anything, and resubmit to regenerate the profile.

## 📡 API

| Method | Endpoint      | Description                                 |
| ------ | ------------- | ------------------------------------------- |
| POST   | `/api/form`   | Submit form as `multipart/form-data`         |
| GET    | `/api/health` | Health check                                |

### POST /api/form fields

| Field          | Type   | Validation                                 |
| -------------- | ------ | ------------------------------------------ |
| `fullName`     | text   | required, min 3 characters                 |
| `email`        | email  | required, valid email format               |
| `phone`        | tel    | required, 10–15 digits only                |
| `dateOfBirth`  | date   | required, not a future date                |
| `department`   | select | required, one of 6 allowed options         |
| `profileImage` | file   | required, JPG/JPEG/PNG/WebP, max 2 MB       |
| `message`      | text   | required, min 10 characters                |

### Response shapes

**Success (201):**

```json
{
  "success": true,
  "message": "Form submitted successfully!",
  "data": {
    "id": "...",
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "dateOfBirth": "...",
    "department": "...",
    "message": "...",
    "profileImage": "http://localhost:5000/uploads/...",
    "submittedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

**Validation error (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Please enter a valid email address" }]
}
```

## 📁 Folder Structure

```
light-form-app/
├── client/
│   ├── src/
│   │   ├── components/   # FormField, FileUpload, Loader, Icons,
│   │   │                 # ProfileCard, PageTransition
│   │   ├── pages/        # HomePage (form ↔ profile view management)
│   │   ├── services/     # api.js (Axios instance)
│   │   ├── hooks/        # useFormSubmission
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── routes/           # formRoutes.js
    ├── controllers/      # formController.js
    ├── middleware/       # upload.js, errorHandler.js
    ├── validators/       # formValidator.js
    ├── uploads/          # stored profile images (git-ignored)
    ├── app.js
    └── server.js
```

## 🎨 Design

- **Light theme** — white/off-white surfaces, slate text
- **Accent color** — blue (`#2563EB`) with soft gradients
- **Animations** — fade-in-up, slide-up, scale-in, hover lifts
- **Fully responsive** — grid layouts collapse gracefully on mobile

