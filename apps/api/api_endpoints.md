# ExamDex API Endpoints

**Base URL**: `http://localhost:3001/api/v1`

## 🔐 Auth
- `POST /auth/admin/login` - Admin Login
- `POST /auth/student` - Send Student OTP
- `POST /auth/verify-otp` - Verify OTP & Login
- `POST /auth/refresh` - Refresh Token
- `POST /auth/logout` - Logout

## 📝 Exams
- `GET /exams` - List all exams (Filters: `active`, `popular`)
- `POST /exams` - Create exam
- `GET /exams/:id` - Get exam by ID
- `PATCH /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam

## 📚 Subjects
- `GET /subjects` - List all subjects (Filter: `active`)
- `POST /subjects` - Create subject
- `GET /subjects/:id` - Get subject by ID
- `PATCH /subjects/:id` - Update subject
- `DELETE /subjects/:id` - Delete subject

## 📑 Chapters
- `GET /chapters` - List all chapters (Filters: `subjectId`, `classId`, `active`)
- `POST /chapters` - Create chapter
- `POST /chapters/bulk` - Bulk create chapters for a subject
  - Body: `{ subjectId, chapters: [{ chapterCode, chapterName, classId? }] }`
- `GET /chapters/:id` - Get chapter by ID
- `PATCH /chapters/:id` - Update chapter
- `DELETE /chapters/:id` - Delete chapter

## 🔗 Exam-Subject Mapping
- `GET /exam-subject` - List all mappings
- `POST /exam-subject` - Map subject to exam
- `POST /exam-subject/bulk` - Map multiple subjects to one exam
  - Body: `{ examId, items: [{ subjectId, displayOrder }] }`
- `GET /exam-subject/:id` - Get mapping by ID
- `PATCH /exam-subject/:id` - Update mapping (displayOrder, isActive)
- `DELETE /exam-subject/:id` - Unmap subject from exam
- `GET /exam-subject/by-exam/:examId` - Get subjects for a specific exam
- `GET /exam-subject/by-subject/:subjectId` - Get exams for a specific subject

## 📊 Excel Bulk Upload
- `POST /excel/exam` - Bulk import exams via Excel
- `POST /excel/subject` - Bulk import subjects via Excel
- `POST /excel/chapter` - Bulk import chapters via Excel

## 🏢 Classes
- `GET /classes` - List all classes
- `POST /classes` - Create class
- `GET /classes/code/:classCode` - Get class by code
- `GET /classes/:id` - Get class by ID
- `PATCH /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class

## 💰 Pricing Tiers
- `GET /pricing-tiers` - List all tiers
- `POST /pricing-tiers` - Create tier
- `GET /pricing-tiers/:id` - Get tier by ID
- `PATCH /pricing-tiers/:id` - Update tier
- `DELETE /pricing-tiers/:id` - Delete tier

## 👥 Users
- `GET /users` - List all users
- `POST /users` - Create user (Admin/Student)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🛠️ Misc
- `GET /health` - API Health Check
- `POST /dev/seed-admin` - Seed initial admin (Dev only)
