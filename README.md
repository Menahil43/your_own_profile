# 📋 Light Form App — Full-Stack Registration Form

A polished, **light-themed**, fully responsive full-stack form application.

## Tech Stack

| Layer     | Tools                                                                 |
| --------- | --------------------------------------------------------------------- |
| Frontend  | React 18 (Vite), Tailwind CSS, React Hook Form + Zod, Axios, React Toastify |
| Backend   | Node.js, Express, Multer, express-validator                           |

## Features

- ✅ 7 form fields with field-specific **client + server** validation
- ✅ Drag-and-drop image upload (JPG / JPEG / PNG / WebP, max 2 MB) with live preview
- ✅ Loading spinner + **Submitting...** text, disabled button, duplicate-submit prevention
- ✅ Green success toast & red error toast
- ✅ Form resets **only after** a successful submission
- ✅ Clean, modern light theme — white/off-white surfaces, blue (#2563EB) accents, soft shadows, rounded corners, fully responsive

## Quick Start

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

> The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra CORS configuration is needed in development.

## API

| Method | Endpoint      | Description                                  |
| ------ | ------------- | -------------------------------------------- |
| POST   | `/api/form`   | Submit form as `multipart/form-data`          |
| GET    | `/api/health` | Health check                                 |

### POST /api/form fields

| Field         | Type   | Validation                                    |
| ------------- | ------ | --------------------------------------------- |
| `fullName`    | text   | required, min 3 characters                    |
| `email`       | email  | required, valid email format                  |
| `phone`       | tel    | required, 10–15 digits only                   |
| `dateOfBirth` | date   | required, not a future date                   |
| `department`  | select | required, must be one of 6 allowed options    |
| `profileImage`| file   | required, JPG/JPEG/PNG/WebP, max 2 MB          |
| `message`     | text   | required, min 10 characters                   |

### Response shapes

**Success (201):**

```json
{
  "success": true,
  "message": "Form submitted successfully!",
  "data": { "id": "...", "fullName": "...", "profileImage": "/uploads/...", "...": "..." }
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

## Folder Structure

```
light-form-app/
├── client/
│   ├── src/
│   │   ├── components/   # FormField, FileUpload, Icons
│   │   ├── pages/        # HomePage
│   │   ├── services/     # api.js (Axios)
│   │   ├── hooks/        # useFormSubmission
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── validators/
    ├── uploads/
    ├── app.js
    └── server.js
```

