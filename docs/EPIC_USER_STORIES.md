# ExamDex - Master Data & Mapping Management

## Epic & User Stories Document

---

## **EPIC 1: Master Data Management Foundation**

**Goal:** Establish normalized master data structure for Exams, Subjects, Chapters, and Classes  
**Business Value:** Enable content reusability across multiple exams, reduce data duplication, improve content management efficiency  
**Start Date:** Feb 3, 2026  
**End Date:** Feb 10, 2026  
**Status:** Not Started

---

### **User Story 1.1: Exam Master Data Management**

**As a** content manager  
**I want to** create and manage exam master records (JEE, NEET, CBSE, etc.)  
**So that** I can define which exams are available in the system and mark popular ones

**Acceptance Criteria:**

- [ ] Can create a new exam with code, name, full name, board, and popularity flag
- [ ] Exam codes must be unique and follow format (uppercase, numbers, hyphens only)
- [ ] Can mark exams as "popular" to show them first in UI
- [ ] Can list all exams with filters (active only, popular only)
- [ ] Can update exam details (name, board, active status, popularity)
- [ ] Can soft-delete exams (mark as inactive)
- [ ] Popular exams appear first in sorted lists

**Start Date:** Feb 3, 2026  
**End Date:** Feb 4, 2026  
**Dependencies:** None  
**Priority:** P0 (Critical)

---

### **User Story 1.2: Subject Master Data Management**

**As a** content manager  
**I want to** create and manage subject master records (Physics, Chemistry, Mathematics, etc.)  
**So that** I can define subjects once and reuse them across multiple exams

**Acceptance Criteria:**

- [ ] Can create a new subject with unique code and name
- [ ] Subject codes must be unique across the entire system
- [ ] Can list all subjects with active/inactive filter
- [ ] Can update subject name and active status
- [ ] Can soft-delete subjects (mark as inactive)
- [ ] Cannot delete subjects that are mapped to exams
- [ ] Subjects are sorted alphabetically by default

**Start Date:** Feb 3, 2026  
**End Date:** Feb 4, 2026  
**Dependencies:** None  
**Priority:** P0 (Critical)

---

### **User Story 1.3: Chapter Master Data Management**

**As a** content manager  
**I want to** create and manage chapter master records  
**So that** I can organize content by chapters within subjects

**Acceptance Criteria:**

- [ ] Can create a new chapter with subject association, code, and name
- [ ] Chapter codes must be unique within a subject
- [ ] Can optionally associate chapters with a class/grade level (Class 11, Class 12)
- [ ] Can list chapters filtered by subject, class, or active status
- [ ] Can update chapter name, class association, and active status
- [ ] Can soft-delete chapters (mark as inactive)
- [ ] Cannot delete chapters that have uploaded content
- [ ] Chapters are sorted alphabetically within a subject

**Start Date:** Feb 4, 2026  
**End Date:** Feb 5, 2026  
**Dependencies:** User Story 1.2  
**Priority:** P0 (Critical)

---

### **User Story 1.4: Class/Grade Level Management**

**As a** content manager  
**I want to** create and manage class/grade levels (Class 11, Class 12, etc.)  
**So that** I can organize chapters by educational level

**Acceptance Criteria:**

- [ ] Can create a new class with unique code and name
- [ ] Class codes must be unique (e.g., "CLASS_11", "CLASS_12")
- [ ] Can list all classes with active/inactive filter
- [ ] Can update class name and active status
- [ ] Can soft-delete classes (mark as inactive)
- [ ] Cannot delete classes that are associated with chapters
- [ ] Classes are sorted by code/name

**Start Date:** Feb 5, 2026  
**End Date:** Feb 5, 2026  
**Dependencies:** None  
**Priority:** P1 (High)

---

## **EPIC 2: Exam-Subject Mapping Management**

**Goal:** Enable many-to-many relationships between exams and subjects  
**Business Value:** Allow subjects like "Physics" to be shared across JEE, NEET, and other exams  
**Start Date:** Feb 6, 2026  
**End Date:** Feb 12, 2026  
**Status:** Not Started

---

### **User Story 2.1: Map Subjects to Exams**

**As a** content manager  
**I want to** assign subjects to specific exams  
**So that** I can define which subjects are part of which exam syllabus

**Acceptance Criteria:**

- [ ] Can add a subject to an exam (create ExamSubject mapping)
- [ ] Cannot add the same subject to an exam twice
- [ ] Can set display order for subjects within an exam
- [ ] Can mark exam-subject mapping as active/inactive
- [ ] Can view all subjects mapped to a specific exam
- [ ] Can view all exams that include a specific subject
- [ ] Mappings are sorted by display order, then alphabetically

**Start Date:** Feb 6, 2026  
**End Date:** Feb 7, 2026  
**Dependencies:** User Stories 1.1, 1.2  
**Priority:** P0 (Critical)

---

### **User Story 2.2: Remove Subject from Exam**

**As a** content manager  
**I want to** remove a subject from an exam  
**So that** I can update exam syllabi when requirements change

**Acceptance Criteria:**

- [ ] Can soft-delete exam-subject mapping (mark as inactive)
- [ ] Can permanently delete mapping if no dependent data exists
- [ ] Cannot delete if there are generated papers using this mapping
- [ ] Cannot delete if there are subject-chapter mappings for this exam-subject
- [ ] Deletion shows clear warning about dependent data
- [ ] Audit trail tracks who deleted and when

**Start Date:** Feb 7, 2026  
**End Date:** Feb 8, 2026  
**Dependencies:** User Story 2.1  
**Priority:** P1 (High)

---

### **User Story 2.3: Reorder Subjects within Exam**

**As a** content manager  
**I want to** change the display order of subjects within an exam  
**So that** subjects appear in the correct sequence for students

**Acceptance Criteria:**

- [ ] Can update display order for exam-subject mappings
- [ ] Can drag-and-drop to reorder (frontend)
- [ ] Order changes are persisted immediately
- [ ] Order is reflected in all student-facing views
- [ ] Can bulk update order for multiple subjects

**Start Date:** Feb 8, 2026  
**End Date:** Feb 9, 2026  
**Dependencies:** User Story 2.1  
**Priority:** P2 (Medium)

---

## **EPIC 3: Subject-Chapter Mapping Management**

**Goal:** Configure exam-specific chapter settings (weightage, chapter numbers)  
**Business Value:** Allow same chapter to have different weightage/numbering across exams  
**Start Date:** Feb 10, 2026  
**End Date:** Feb 17, 2026  
**Status:** Not Started

---

### **User Story 3.1: Map Chapters to Exam-Subject**

**As a** content manager  
**I want to** assign chapters to exam-subject combinations  
**So that** I can define which chapters are part of each exam's subject syllabus

**Acceptance Criteria:**

- [ ] Can add a chapter to an exam-subject (create SubjectChapter mapping)
- [ ] Cannot add the same chapter to an exam-subject twice
- [ ] Can set chapter number specific to the exam
- [ ] Can set weightage percentage for the chapter in this exam
- [ ] Can mark chapter mapping as active/inactive
- [ ] Can view all chapters for a specific exam-subject
- [ ] Total weightage across all chapters should ideally be 100%
- [ ] System warns if total weightage != 100%

**Start Date:** Feb 10, 2026  
**End Date:** Feb 12, 2026  
**Dependencies:** User Stories 1.3, 2.1  
**Priority:** P0 (Critical)

---

### **User Story 3.2: Configure Chapter Weightage**

**As a** content manager  
**I want to** set different weightage percentages for the same chapter across different exams  
**So that** chapter importance reflects each exam's specific syllabus

**Acceptance Criteria:**

- [ ] Can update weightage percentage for a chapter in an exam
- [ ] Weightage must be between 0 and 100
- [ ] Can view total weightage for all chapters in an exam-subject
- [ ] System highlights if total weightage is not 100%
- [ ] Can bulk update weightages for multiple chapters
- [ ] Changes are reflected in paper generation algorithms

**Start Date:** Feb 12, 2026  
**End Date:** Feb 13, 2026  
**Dependencies:** User Story 3.1  
**Priority:** P1 (High)

---

### **User Story 3.3: Set Chapter Numbers per Exam**

**As a** content manager  
**I want to** assign different chapter numbers for the same chapter across exams  
**So that** chapter numbering matches each exam's official syllabus

**Acceptance Criteria:**

- [ ] Can set chapter number for a chapter in an exam-subject
- [ ] Chapter numbers can be different across exams for the same chapter
- [ ] Can leave chapter number blank (optional)
- [ ] Chapters can be sorted by chapter number
- [ ] System warns if duplicate chapter numbers exist in same exam-subject

**Start Date:** Feb 13, 2026  
**End Date:** Feb 14, 2026  
**Dependencies:** User Story 3.1  
**Priority:** P2 (Medium)

---

### **User Story 3.4: Remove Chapter from Exam-Subject**

**As a** content manager  
**I want to** remove a chapter from an exam-subject  
**So that** I can update syllabi when chapters are removed

**Acceptance Criteria:**

- [ ] Can soft-delete subject-chapter mapping (mark as inactive)
- [ ] Can permanently delete if no dependent data exists
- [ ] Cannot delete if there are generated papers using this chapter
- [ ] Cannot delete if there is uploaded content for this chapter
- [ ] Deletion shows clear warning about dependent data
- [ ] Audit trail tracks who deleted and when

**Start Date:** Feb 14, 2026  
**End Date:** Feb 15, 2026  
**Dependencies:** User Story 3.1  
**Priority:** P1 (High)

---

## **EPIC 4: Content Manager UI - Master Data**

**Goal:** Build intuitive admin interface for managing master data  
**Business Value:** Enable non-technical users to manage exam structure efficiently  
**Start Date:** Feb 11, 2026  
**End Date:** Feb 20, 2026  
**Status:** Not Started

---

### **User Story 4.1: Exam Management Dashboard**

**As a** content manager  
**I want to** view and manage all exams in a dashboard  
**So that** I can quickly see and edit exam information

**Acceptance Criteria:**

- [ ] Dashboard shows list of all exams with key info (code, name, board, popular flag)
- [ ] Can filter by active/inactive, popular/non-popular
- [ ] Can search exams by code or name
- [ ] Can click to view/edit exam details
- [ ] Can create new exam via modal/form
- [ ] Can toggle popular flag with single click
- [ ] Can toggle active/inactive status
- [ ] Popular exams are visually highlighted
- [ ] Responsive design works on tablet/desktop

**Start Date:** Feb 11, 2026  
**End Date:** Feb 13, 2026  
**Dependencies:** User Story 1.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 4.2: Subject Management Dashboard**

**As a** content manager  
**I want to** view and manage all subjects in a dashboard  
**So that** I can maintain the subject catalog

**Acceptance Criteria:**

- [ ] Dashboard shows list of all subjects with code and name
- [ ] Can filter by active/inactive
- [ ] Can search subjects by code or name
- [ ] Can click to view/edit subject details
- [ ] Can create new subject via modal/form
- [ ] Can toggle active/inactive status
- [ ] Shows count of exams using each subject
- [ ] Prevents deletion if subject is in use
- [ ] Responsive design works on tablet/desktop

**Start Date:** Feb 13, 2026  
**End Date:** Feb 15, 2026  
**Dependencies:** User Story 1.2 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 4.3: Chapter Management Dashboard**

**As a** content manager  
**I want to** view and manage chapters organized by subject  
**So that** I can maintain the chapter catalog

**Acceptance Criteria:**

- [ ] Dashboard shows chapters grouped by subject
- [ ] Can filter by subject, class, active/inactive
- [ ] Can search chapters by code or name
- [ ] Can click to view/edit chapter details
- [ ] Can create new chapter via modal/form
- [ ] Can assign chapter to class/grade level
- [ ] Can toggle active/inactive status
- [ ] Shows count of exams using each chapter
- [ ] Prevents deletion if chapter is in use
- [ ] Responsive design works on tablet/desktop

**Start Date:** Feb 15, 2026  
**End Date:** Feb 17, 2026  
**Dependencies:** User Stories 1.3, 1.4 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 4.4: Class/Grade Management Dashboard**

**As a** content manager  
**I want to** view and manage class/grade levels  
**So that** I can organize chapters by educational level

**Acceptance Criteria:**

- [ ] Dashboard shows list of all classes
- [ ] Can filter by active/inactive
- [ ] Can create new class via modal/form
- [ ] Can edit class details
- [ ] Can toggle active/inactive status
- [ ] Shows count of chapters associated with each class
- [ ] Prevents deletion if class is in use
- [ ] Simple, clean interface

**Start Date:** Feb 17, 2026  
**End Date:** Feb 18, 2026  
**Dependencies:** User Story 1.4 (Backend)  
**Priority:** P1 (High)

---

## **EPIC 5: Content Manager UI - Mapping Management**

**Goal:** Build intuitive admin interface for managing exam-subject-chapter relationships  
**Business Value:** Enable visual mapping of exam structures without technical knowledge  
**Start Date:** Feb 18, 2026  
**End Date:** Feb 28, 2026  
**Status:** Not Started

---

### **User Story 5.1: Exam-Subject Mapping Interface**

**As a** content manager  
**I want to** visually map subjects to exams  
**So that** I can easily configure which subjects belong to each exam

**Acceptance Criteria:**

- [ ] Can select an exam to view its subjects
- [ ] Shows all available subjects with checkboxes/toggle
- [ ] Can add/remove subjects from exam
- [ ] Can set display order via drag-and-drop
- [ ] Can set display order via number input
- [ ] Changes are saved automatically or with clear save button
- [ ] Shows confirmation before removing subjects
- [ ] Visual indicator for subjects already in use
- [ ] Can bulk add multiple subjects at once

**Start Date:** Feb 18, 2026  
**End Date:** Feb 21, 2026  
**Dependencies:** User Story 2.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 5.2: Subject-Chapter Mapping Interface**

**As a** content manager  
**I want to** visually map chapters to exam-subjects with weightage  
**So that** I can configure exam-specific chapter settings

**Acceptance Criteria:**

- [ ] Can select exam → subject to view chapters
- [ ] Shows all available chapters for the subject
- [ ] Can add/remove chapters from exam-subject
- [ ] Can set chapter number for each chapter
- [ ] Can set weightage percentage for each chapter
- [ ] Shows total weightage with visual indicator (progress bar)
- [ ] Warns if total weightage != 100%
- [ ] Can bulk edit weightages
- [ ] Can copy chapter mappings from another exam
- [ ] Changes are saved with clear feedback

**Start Date:** Feb 21, 2026  
**End Date:** Feb 25, 2026  
**Dependencies:** User Story 3.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 5.3: Exam Structure Overview**

**As a** content manager  
**I want to** see a complete hierarchical view of an exam's structure  
**So that** I can verify the entire exam configuration at a glance

**Acceptance Criteria:**

- [ ] Shows exam → subjects → chapters in tree/hierarchical view
- [ ] Displays key info: subject names, chapter counts, weightages
- [ ] Can expand/collapse sections
- [ ] Can quick-edit weightages inline
- [ ] Can quick-toggle active/inactive status
- [ ] Shows visual warnings for configuration issues
- [ ] Can export structure as PDF/Excel
- [ ] Can print-friendly view

**Start Date:** Feb 25, 2026  
**End Date:** Feb 27, 2026  
**Dependencies:** User Stories 5.1, 5.2  
**Priority:** P1 (High)

---

## **EPIC 6: Student-Facing Features**

**Goal:** Enable students to browse and select exam structures for paper generation  
**Business Value:** Provide intuitive exam/subject/chapter selection for practice papers  
**Start Date:** Feb 24, 2026  
**End Date:** Mar 5, 2026  
**Status:** Not Started

---

### **User Story 6.1: Exam Selection for Students**

**As a** student  
**I want to** select my target exam  
**So that** I can generate practice papers for the right exam

**Acceptance Criteria:**

- [ ] Shows list of active exams
- [ ] Popular exams are shown first
- [ ] Can search/filter exams
- [ ] Shows exam full name and board
- [ ] Can save exam preference to profile
- [ ] Selected exam persists across sessions
- [ ] Clean, mobile-friendly interface

**Start Date:** Feb 24, 2026  
**End Date:** Feb 26, 2026  
**Dependencies:** User Story 1.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 6.2: Subject Selection for Paper Generation**

**As a** student  
**I want to** select a subject from my chosen exam  
**So that** I can generate subject-specific practice papers

**Acceptance Criteria:**

- [ ] Shows subjects available for selected exam
- [ ] Subjects are shown in configured display order
- [ ] Shows subject names clearly
- [ ] Can select one subject at a time
- [ ] Mobile-friendly selection interface
- [ ] Fast loading and responsive

**Start Date:** Feb 26, 2026  
**End Date:** Feb 27, 2026  
**Dependencies:** User Stories 6.1, 2.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 6.3: Chapter Selection for Paper Generation**

**As a** student  
**I want to** select specific chapters from a subject  
**So that** I can practice targeted topics

**Acceptance Criteria:**

- [ ] Shows chapters for selected exam-subject
- [ ] Can filter chapters by class (Class 11/12)
- [ ] Can select multiple chapters
- [ ] Can select all chapters with one click
- [ ] Shows chapter numbers if configured
- [ ] Shows chapter names clearly
- [ ] Can save chapter preferences
- [ ] Mobile-friendly multi-select interface

**Start Date:** Feb 27, 2026  
**End Date:** Mar 1, 2026  
**Dependencies:** User Stories 6.2, 3.1 (Backend)  
**Priority:** P0 (Critical)

---

### **User Story 6.4: Class-Based Chapter Filtering**

**As a** student  
**I want to** filter chapters by class level (Class 11, Class 12)  
**So that** I can focus on relevant chapters for my current grade

**Acceptance Criteria:**

- [ ] Shows class filter options (Class 11, Class 12, All)
- [ ] Filtering is instant (no page reload)
- [ ] Selected filter persists during session
- [ ] Clear visual indication of active filter
- [ ] Can select chapters from multiple classes
- [ ] Works seamlessly on mobile

**Start Date:** Mar 1, 2026  
**End Date:** Mar 2, 2026  
**Dependencies:** User Story 6.3  
**Priority:** P1 (High)

---

## **EPIC 7: Data Migration & Seeding**

**Goal:** Migrate existing data to new normalized structure and create seed data  
**Business Value:** Ensure smooth transition without data loss  
**Start Date:** Feb 16, 2026  
**End Date:** Feb 19, 2026  
**Status:** Not Started

---

### **User Story 7.1: Data Migration Script**

**As a** developer  
**I want to** migrate existing exam/subject/chapter data to new structure  
**So that** we don't lose any existing data

**Acceptance Criteria:**

- [ ] Script identifies all unique subjects across exams
- [ ] Creates master subject records
- [ ] Creates exam-subject mappings
- [ ] Migrates chapter data to new structure
- [ ] Creates subject-chapter mappings with weightages
- [ ] Preserves all existing relationships
- [ ] Generates migration report
- [ ] Can rollback if issues occur
- [ ] Tested on staging environment first

**Start Date:** Feb 16, 2026  
**End Date:** Feb 18, 2026  
**Dependencies:** All backend APIs complete  
**Priority:** P0 (Critical)

---

### **User Story 7.2: Seed Data for Development**

**As a** developer  
**I want to** have realistic seed data for development/testing  
**So that** I can test features with representative data

**Acceptance Criteria:**

- [ ] Seeds 5-10 popular exams (JEE, NEET, CBSE, etc.)
- [ ] Seeds common subjects (Physics, Chemistry, Math, Biology)
- [ ] Seeds realistic chapters for each subject
- [ ] Creates exam-subject mappings
- [ ] Creates subject-chapter mappings with weightages
- [ ] Includes Class 11 and Class 12 data
- [ ] Seed script is idempotent (can run multiple times)
- [ ] Clear documentation on how to run seeds

**Start Date:** Feb 18, 2026  
**End Date:** Feb 19, 2026  
**Dependencies:** User Story 7.1  
**Priority:** P1 (High)

---

---

## **EPIC 8: Authentication & User Management**

**Goal:** Implement secure authentication system with OTP-based login  
**Business Value:** Enable secure user access with phone/email verification  
**Start Date:** Mar 3, 2026  
**End Date:** Mar 12, 2026  
**Status:** Not Started

---

### **User Story 8.1: Phone/Email Registration**

**As a** new student  
**I want to** register using my phone number or email  
**So that** I can create an account and access the platform

**Acceptance Criteria:**

- [ ] Can register with phone number (Indian format validation)
- [ ] Can register with email address
- [ ] Phone numbers are validated using Twilio
- [ ] Email addresses are validated for format
- [ ] Cannot register with already-used phone/email
- [ ] User provides full name during registration
- [ ] User selects user type (student by default)
- [ ] Registration triggers OTP generation
- [ ] Clear error messages for validation failures
- [ ] Mobile-responsive registration form

**Start Date:** Mar 3, 2026  
**End Date:** Mar 5, 2026  
**Dependencies:** OTP infrastructure (already built)  
**Priority:** P0 (Critical)

---

### **User Story 8.2: OTP-Based Login**

**As a** registered user  
**I want to** login using OTP sent to my phone/email  
**So that** I can securely access my account without remembering passwords

**Acceptance Criteria:**

- [ ] Can request OTP via SMS (Twilio)
- [ ] Can request OTP via email (SMTP)
- [ ] OTP is 6 digits and expires in 10 minutes
- [ ] Maximum 3 verification attempts per OTP
- [ ] Rate limiting: max 3 OTP requests per 15 minutes
- [ ] Fallback: if SMS fails, can use email OTP
- [ ] Clear countdown timer showing OTP expiry
- [ ] Can resend OTP after expiry
- [ ] OTP is hashed in database for security
- [ ] Auto-login after successful OTP verification

**Start Date:** Mar 5, 2026  
**End Date:** Mar 7, 2026  
**Dependencies:** User Story 8.1  
**Priority:** P0 (Critical)

---

### **User Story 8.3: JWT Token Management**

**As a** logged-in user  
**I want to** stay logged in across sessions  
**So that** I don't have to re-authenticate frequently

**Acceptance Criteria:**

- [ ] Access token issued after successful login (15min expiry)
- [ ] Refresh token issued for long-term sessions (7 days)
- [ ] Access token stored in memory/state
- [ ] Refresh token stored in httpOnly cookie
- [ ] Automatic token refresh before expiry
- [ ] Logout clears both tokens
- [ ] Token includes user ID, email, user type, roles
- [ ] Protected routes validate JWT tokens
- [ ] Invalid/expired tokens trigger re-authentication

**Start Date:** Mar 7, 2026  
**End Date:** Mar 8, 2026  
**Dependencies:** User Story 8.2  
**Priority:** P0 (Critical)

---

### **User Story 8.4: User Profile Management**

**As a** student  
**I want to** view and update my profile information  
**So that** I can keep my account details current

**Acceptance Criteria:**

- [ ] Can view full name, phone, email
- [ ] Can update full name
- [ ] Can add email if registered with phone (and vice versa)
- [ ] Cannot change primary phone/email (security)
- [ ] Can view account creation date
- [ ] Can view last login timestamp
- [ ] Can view device fingerprint (for security)
- [ ] Profile updates require OTP verification
- [ ] Mobile-responsive profile page

**Start Date:** Mar 8, 2026  
**End Date:** Mar 9, 2026  
**Dependencies:** User Story 8.3  
**Priority:** P1 (High)

---

### **User Story 8.5: User Preferences & Settings**

**As a** student  
**I want to** save my exam and subject preferences  
**So that** the app remembers my choices

**Acceptance Criteria:**

- [ ] Can set primary exam preference
- [ ] Can set target exam date
- [ ] Can save multiple exam preferences
- [ ] One exam can be marked as primary
- [ ] Preferences persist across sessions
- [ ] Preferences pre-populate in paper generation flow
- [ ] Can update or remove preferences
- [ ] Mobile-friendly settings interface

**Start Date:** Mar 9, 2026  
**End Date:** Mar 10, 2026  
**Dependencies:** User Story 8.4, Epic 1 (Exam APIs)  
**Priority:** P1 (High)

---

### **User Story 8.6: Session Management & Security**

**As a** user  
**I want to** see my active sessions and logout from devices  
**So that** I can secure my account

**Acceptance Criteria:**

- [ ] Can view all active sessions
- [ ] Shows device info, location, last active time
- [ ] Can logout from specific session
- [ ] Can logout from all sessions
- [ ] Current session is highlighted
- [ ] Session tracking uses device fingerprint
- [ ] Suspicious activity alerts (optional)
- [ ] Auto-logout after 30 days of inactivity

**Start Date:** Mar 10, 2026  
**End Date:** Mar 12, 2026  
**Dependencies:** User Story 8.3  
**Priority:** P2 (Medium)

---

## **EPIC 9: Credit System & Wallet**

**Goal:** Implement credit-based economy for paper generation  
**Business Value:** Enable monetization and control resource usage  
**Start Date:** Mar 10, 2026  
**End Date:** Mar 19, 2026  
**Status:** Not Started

---

### **User Story 9.1: Credit Balance Display**

**As a** student  
**I want to** see my current credit balance  
**So that** I know how many papers I can generate

**Acceptance Criteria:**

- [ ] Credit balance visible in header/navbar
- [ ] Shows total credits purchased
- [ ] Shows current available balance
- [ ] Updates in real-time after transactions
- [ ] Visual indicator when balance is low (<10 credits)
- [ ] Can click to view detailed transaction history
- [ ] Mobile-friendly display

**Start Date:** Mar 10, 2026  
**End Date:** Mar 11, 2026  
**Dependencies:** User Story 8.3 (Auth)  
**Priority:** P0 (Critical)

---

### **User Story 9.2: Credit Transaction History**

**As a** student  
**I want to** view my complete credit transaction history  
**So that** I can track how I've used my credits

**Acceptance Criteria:**

- [ ] Shows all credit transactions (purchases, usage, refunds)
- [ ] Displays transaction type, amount, balance after, date
- [ ] Shows related paper ID for generation transactions
- [ ] Can filter by transaction type
- [ ] Can filter by date range
- [ ] Paginated list (20 per page)
- [ ] Can export history as PDF/CSV
- [ ] Mobile-responsive table/list view

**Start Date:** Mar 11, 2026  
**End Date:** Mar 12, 2026  
**Dependencies:** User Story 9.1  
**Priority:** P1 (High)

---

### **User Story 9.3: Pricing Tiers Management (Admin)**

**As a** admin  
**I want to** configure credit pricing tiers  
**So that** I can offer different purchase options to students

**Acceptance Criteria:**

- [ ] Can create pricing tiers (e.g., 10 credits for ₹99)
- [ ] Each tier has: name, code, price, credits, bonus credits
- [ ] Can set display order for tiers
- [ ] Can mark tiers as active/inactive
- [ ] Can update pricing without affecting past purchases
- [ ] Bonus credits are added automatically
- [ ] Admin dashboard shows all tiers
- [ ] Can track which tiers are most popular

**Start Date:** Mar 12, 2026  
**End Date:** Mar 13, 2026  
**Dependencies:** User Story 8.3 (Auth)  
**Priority:** P0 (Critical)

---

### **User Story 9.4: Credit Deduction for Paper Generation**

**As a** student  
**I want to** have credits automatically deducted when I generate a paper  
**So that** the system tracks my usage

**Acceptance Criteria:**

- [ ] Credits are deducted only after successful paper generation
- [ ] Deduction amount is configurable (default: 1 credit per paper)
- [ ] Cannot generate paper if insufficient credits
- [ ] Clear error message when balance is insufficient
- [ ] Transaction record created for each deduction
- [ ] Balance updates immediately after deduction
- [ ] Failed generations don't deduct credits
- [ ] Partial generations are handled gracefully

**Start Date:** Mar 13, 2026  
**End Date:** Mar 14, 2026  
**Dependencies:** User Story 9.1  
**Priority:** P0 (Critical)

---

### **User Story 9.5: Admin Credit Management**

**As an** admin  
**I want to** manually grant or deduct credits from user accounts  
**So that** I can handle support requests and promotions

**Acceptance Criteria:**

- [ ] Can search for user by phone/email
- [ ] Can view user's current balance
- [ ] Can grant credits with reason/notes
- [ ] Can deduct credits with reason/notes
- [ ] Transaction is recorded with admin ID
- [ ] User receives notification of credit change
- [ ] Audit trail tracks all manual adjustments
- [ ] Bulk credit grant for promotions (optional)

**Start Date:** Mar 14, 2026  
**End Date:** Mar 15, 2026  
**Dependencies:** User Story 9.1  
**Priority:** P1 (High)

---

## **EPIC 10: Payment Integration (Razorpay)**

**Goal:** Enable students to purchase credits via Razorpay  
**Business Value:** Generate revenue through credit sales  
**Start Date:** Mar 16, 2026  
**End Date:** Mar 25, 2026  
**Status:** Not Started

---

### **User Story 10.1: Pricing Tiers Display**

**As a** student  
**I want to** see available credit packages  
**So that** I can choose which package to purchase

**Acceptance Criteria:**

- [ ] Shows all active pricing tiers
- [ ] Displays price, credits, bonus credits clearly
- [ ] Highlights best value/popular packages
- [ ] Shows price in INR (₹)
- [ ] Mobile-responsive card layout
- [ ] Can select a tier to proceed to payment
- [ ] Shows total credits (base + bonus)
- [ ] Sorted by display order

**Start Date:** Mar 16, 2026  
**End Date:** Mar 17, 2026  
**Dependencies:** User Story 9.3  
**Priority:** P0 (Critical)

---

### **User Story 10.2: Razorpay Payment Initiation**

**As a** student  
**I want to** initiate a payment for selected credit package  
**So that** I can purchase credits

**Acceptance Criteria:**

- [ ] Clicking "Buy" opens Razorpay payment modal
- [ ] Payment amount matches selected tier
- [ ] User details pre-filled (name, email, phone)
- [ ] Supports UPI, cards, net banking, wallets
- [ ] Payment modal is mobile-responsive
- [ ] Order is created in backend before payment
- [ ] Order ID is tracked for reconciliation
- [ ] Can cancel payment and return to tier selection

**Start Date:** Mar 17, 2026  
**End Date:** Mar 19, 2026  
**Dependencies:** User Story 10.1  
**Priority:** P0 (Critical)

---

### **User Story 10.3: Payment Success Handling**

**As a** student  
**I want to** receive credits immediately after successful payment  
**So that** I can start generating papers right away

**Acceptance Criteria:**

- [ ] Razorpay webhook verifies payment signature
- [ ] Credits are added to user balance immediately
- [ ] Bonus credits are added automatically
- [ ] Transaction record created with payment details
- [ ] User sees success message with new balance
- [ ] Email/SMS confirmation sent to user
- [ ] Payment ID stored for future reference
- [ ] User redirected to dashboard or paper generation

**Start Date:** Mar 19, 2026  
**End Date:** Mar 21, 2026  
**Dependencies:** User Story 10.2  
**Priority:** P0 (Critical)

---

### **User Story 10.4: Payment Failure Handling**

**As a** student  
**I want to** be notified if my payment fails  
**So that** I can retry or use a different payment method

**Acceptance Criteria:**

- [ ] Payment failures are captured from Razorpay
- [ ] User sees clear error message
- [ ] No credits are added on failure
- [ ] Transaction marked as failed in database
- [ ] User can retry payment
- [ ] Failed payment details logged for debugging
- [ ] Support contact info shown on failure
- [ ] Common failure reasons explained (insufficient funds, etc.)

**Start Date:** Mar 21, 2026  
**End Date:** Mar 22, 2026  
**Dependencies:** User Story 10.2  
**Priority:** P0 (Critical)

---

### **User Story 10.5: Payment Reconciliation (Admin)**

**As an** admin  
**I want to** reconcile payments with Razorpay  
**So that** I can ensure all transactions are accounted for

**Acceptance Criteria:**

- [ ] Admin dashboard shows all payment transactions
- [ ] Can filter by status (success, failed, pending)
- [ ] Can filter by date range
- [ ] Shows Razorpay payment ID, order ID, amount
- [ ] Can manually verify payment status with Razorpay
- [ ] Can handle stuck/pending payments
- [ ] Export payment report as CSV/Excel
- [ ] Shows daily/monthly revenue metrics

**Start Date:** Mar 22, 2026  
**End Date:** Mar 23, 2026  
**Dependencies:** User Story 10.3  
**Priority:** P1 (High)

---

### **User Story 10.6: Refund Processing**

**As an** admin  
**I want to** process refunds for customers  
**So that** I can handle support requests

**Acceptance Criteria:**

- [ ] Can initiate refund through Razorpay API
- [ ] Credits are deducted from user balance
- [ ] Refund transaction is recorded
- [ ] User is notified of refund
- [ ] Refund status tracked (initiated, processed, failed)
- [ ] Cannot refund if credits already used
- [ ] Partial refunds supported
- [ ] Audit trail for all refunds

**Start Date:** Mar 23, 2026  
**End Date:** Mar 25, 2026  
**Dependencies:** User Story 10.5  
**Priority:** P2 (Medium)

---

## **EPIC 11: AI Paper Generation**

**Goal:** Generate practice papers using AI based on user selections  
**Business Value:** Core product feature that delivers value to students  
**Start Date:** Mar 6, 2026  
**End Date:** Mar 20, 2026  
**Status:** Not Started

---

### **User Story 11.1: Paper Generation Configuration**

**As a** student  
**I want to** configure my practice paper settings  
**So that** I can customize the paper to my needs

**Acceptance Criteria:**

- [ ] Can select exam, subject, chapters (from Epic 6)
- [ ] Can set total number of questions
- [ ] Can set difficulty distribution (easy/medium/hard %)
- [ ] Can set question types (MCQ single/multiple, numerical, etc.)
- [ ] Can set time limit for the paper
- [ ] Can set marks per question
- [ ] Can enable/disable negative marking
- [ ] Configuration is validated before generation
- [ ] Shows estimated credit cost
- [ ] Mobile-friendly configuration form

**Start Date:** Mar 6, 2026  
**End Date:** Mar 8, 2026  
**Dependencies:** Epic 6 (Student Features)  
**Priority:** P0 (Critical)

---

### **User Story 11.2: AI Prompt Template Management (Admin)**

**As a** content manager  
**I want to** create and manage AI prompt templates  
**So that** I can control paper generation quality

**Acceptance Criteria:**

- [ ] Can create prompt templates for exam-subjects
- [ ] Template includes system prompt and generation rules
- [ ] Can set scope (global, exam-level, subject-level)
- [ ] Can version templates for A/B testing
- [ ] Can mark templates as active/inactive
- [ ] Can view performance metrics (avg rating, success rate)
- [ ] Can include sample output format in template
- [ ] Templates are used by generation engine

**Start Date:** Mar 8, 2026  
**End Date:** Mar 10, 2026  
**Dependencies:** Epic 3 (Subject-Chapter Mapping)  
**Priority:** P0 (Critical)

---

### **User Story 11.3: Paper Generation Engine**

**As a** student  
**I want to** generate a practice paper based on my configuration  
**So that** I can practice for my exam

**Acceptance Criteria:**

- [ ] Validates user has sufficient credits
- [ ] Deducts credits before generation
- [ ] Calls AI API with appropriate prompt template
- [ ] Generates questions based on selected chapters
- [ ] Respects difficulty distribution settings
- [ ] Respects question type distribution
- [ ] Stores complete paper as JSON in database
- [ ] Tracks generation latency and status
- [ ] Handles AI API failures gracefully
- [ ] Refunds credits if generation fails
- [ ] Shows loading state during generation (30-60s)
- [ ] Redirects to paper view on success

**Start Date:** Mar 10, 2026  
**End Date:** Mar 15, 2026  
**Dependencies:** User Stories 11.1, 11.2, 9.4  
**Priority:** P0 (Critical)

---

### **User Story 11.4: Generated Paper Display**

**As a** student  
**I want to** view my generated practice paper  
**So that** I can start attempting it

**Acceptance Criteria:**

- [ ] Shows paper title, exam, subject, date
- [ ] Shows total questions, max marks, time limit
- [ ] Displays questions in clean, readable format
- [ ] Shows question number, marks, difficulty
- [ ] For MCQs, shows options clearly
- [ ] Can bookmark paper for later
- [ ] Can rate paper quality (1-5 stars)
- [ ] Can start attempt from paper view
- [ ] Can download paper as PDF
- [ ] Mobile-responsive paper view

**Start Date:** Mar 15, 2026  
**End Date:** Mar 17, 2026  
**Dependencies:** User Story 11.3  
**Priority:** P0 (Critical)

---

### **User Story 11.5: Paper Library & History**

**As a** student  
**I want to** view all my previously generated papers  
**So that** I can re-attempt or review them

**Acceptance Criteria:**

- [ ] Shows list of all generated papers
- [ ] Displays paper title, subject, date, attempt count
- [ ] Can filter by exam, subject, date range
- [ ] Can search papers by title
- [ ] Shows bookmarked papers separately
- [ ] Sorted by creation date (newest first)
- [ ] Can click to view paper details
- [ ] Shows generation status (success/failed/partial)
- [ ] Paginated list (10-20 per page)
- [ ] Mobile-responsive list view

**Start Date:** Mar 17, 2026  
**End Date:** Mar 18, 2026  
**Dependencies:** User Story 11.4  
**Priority:** P1 (High)

---

### **User Story 11.6: Paper Quality Feedback**

**As a** student  
**I want to** report issues with generated papers  
**So that** the content team can improve quality

**Acceptance Criteria:**

- [ ] Can report errors (incorrect answer, unclear question, etc.)
- [ ] Can select error type from predefined list
- [ ] Can provide additional comments
- [ ] Can report specific questions within a paper
- [ ] Reports are stored with user ID and timestamp
- [ ] Admin can view all error reports
- [ ] Admin can mark reports as reviewed/fixed
- [ ] Feedback improves future generations (ML loop)

**Start Date:** Mar 18, 2026  
**End Date:** Mar 20, 2026  
**Dependencies:** User Story 11.4  
**Priority:** P2 (Medium)

---

## **EPIC 12: Paper Attempt & Assessment**

**Goal:** Enable students to attempt papers and get instant results  
**Business Value:** Complete the learning loop with practice and feedback  
**Start Date:** Mar 18, 2026  
**End Date:** Mar 30, 2026  
**Status:** Not Started

---

### **User Story 12.1: Start Paper Attempt**

**As a** student  
**I want to** start attempting a generated paper  
**So that** I can practice under exam conditions

**Acceptance Criteria:**

- [ ] Can start attempt from paper view
- [ ] Shows timer based on paper time limit
- [ ] Timer counts down and auto-submits at 0
- [ ] Can pause and resume attempt (optional)
- [ ] Attempt number is tracked (1st, 2nd, 3rd attempt)
- [ ] Questions are displayed one at a time or all together
- [ ] Can navigate between questions
- [ ] Can mark questions for review
- [ ] Progress is auto-saved every 30 seconds
- [ ] Mobile-friendly attempt interface

**Start Date:** Mar 18, 2026  
**End Date:** Mar 21, 2026  
**Dependencies:** User Story 11.4  
**Priority:** P0 (Critical)

---

### **User Story 12.2: Answer Submission & Validation**

**As a** student  
**I want to** submit my answers and get instant results  
**So that** I can learn from my mistakes

**Acceptance Criteria:**

- [ ] Can submit answers for each question
- [ ] Answers are validated against correct answers
- [ ] Marks are calculated based on marking scheme
- [ ] Negative marking is applied if enabled
- [ ] Shows correct/incorrect for each question
- [ ] Shows correct answer and explanation
- [ ] Calculates total score and percentage
- [ ] Tracks time spent on each question
- [ ] Stores complete attempt data as JSON
- [ ] Shows detailed result summary

**Start Date:** Mar 21, 2026  
**End Date:** Mar 24, 2026  
**Dependencies:** User Story 12.1  
**Priority:** P0 (Critical)

---

### **User Story 12.3: Result Analysis & Insights**

**As a** student  
**I want to** see detailed analysis of my performance  
**So that** I can identify weak areas

**Acceptance Criteria:**

- [ ] Shows overall score, percentage, rank
- [ ] Shows chapter-wise performance breakdown
- [ ] Shows difficulty-wise performance (easy/medium/hard)
- [ ] Shows question-type-wise performance
- [ ] Shows time management analysis
- [ ] Highlights strong and weak chapters
- [ ] Shows comparison with previous attempts
- [ ] Visual charts for performance metrics
- [ ] Can download result as PDF
- [ ] Mobile-responsive result view

**Start Date:** Mar 24, 2026  
**End Date:** Mar 26, 2026  
**Dependencies:** User Story 12.2  
**Priority:** P1 (High)

---

### **User Story 12.4: Attempt History & Tracking**

**As a** student  
**I want to** view all my paper attempts  
**So that** I can track my progress over time

**Acceptance Criteria:**

- [ ] Shows list of all attempts across all papers
- [ ] Displays paper name, date, score, percentage
- [ ] Can filter by exam, subject, date range
- [ ] Can filter by completion status
- [ ] Shows improvement trends over time
- [ ] Can click to view detailed results
- [ ] Shows best attempt for each paper
- [ ] Paginated list (20 per page)
- [ ] Export history as CSV/PDF

**Start Date:** Mar 26, 2026  
**End Date:** Mar 27, 2026  
**Dependencies:** User Story 12.2  
**Priority:** P1 (High)

---

### **User Story 12.5: Leaderboard & Rankings**

**As a** student  
**I want to** see how I rank compared to other students  
**So that** I can stay motivated

**Acceptance Criteria:**

- [ ] Shows all-time rank based on average scores
- [ ] Shows weekly rank for recent attempts
- [ ] Shows cohort rank (same exam students)
- [ ] Ranks are calculated after each attempt
- [ ] Can view top 100 students
- [ ] Shows own rank even if not in top 100
- [ ] Leaderboard updates in real-time
- [ ] Can filter by exam, subject
- [ ] Privacy: only shows username, not full details
- [ ] Mobile-responsive leaderboard

**Start Date:** Mar 27, 2026  
**End Date:** Mar 29, 2026  
**Dependencies:** User Story 12.2  
**Priority:** P2 (Medium)

---

### **User Story 12.6: Solution Review Mode**

**As a** student  
**I want to** review solutions for all questions  
**So that** I can learn the correct approach

**Acceptance Criteria:**

- [ ] Can access solution review after submission
- [ ] Shows question, student answer, correct answer
- [ ] Shows detailed solution/explanation
- [ ] Highlights incorrect answers in red
- [ ] Highlights correct answers in green
- [ ] Can navigate through all questions
- [ ] Can filter to show only incorrect answers
- [ ] Can bookmark questions for later review
- [ ] Can print solutions
- [ ] Mobile-friendly review interface

**Start Date:** Mar 29, 2026  
**End Date:** Mar 30, 2026  
**Dependencies:** User Story 12.2  
**Priority:** P1 (High)

---

## **Summary Statistics (Updated)**

**Total Epics:** 12  
**Total User Stories:** 54  
**Estimated Duration:** 58 days (Feb 3 - Mar 30, 2026)

**Priority Breakdown:**

- P0 (Critical): 32 stories
- P1 (High): 18 stories
- P2 (Medium): 4 stories

**Epic Timeline:**

1. Master Data Foundation: Feb 3-10 (8 days)
2. Exam-Subject Mapping: Feb 6-12 (7 days)
3. Subject-Chapter Mapping: Feb 10-17 (8 days)
4. Content Manager UI - Master: Feb 11-20 (10 days)
5. Content Manager UI - Mapping: Feb 18-28 (11 days)
6. Student-Facing Features: Feb 24-Mar 5 (10 days)
7. Data Migration: Feb 16-19 (4 days)
8. Authentication & User Management: Mar 3-12 (10 days)
9. Credit System & Wallet: Mar 10-19 (10 days)
10. Payment Integration: Mar 16-25 (10 days)
11. AI Paper Generation: Mar 6-20 (15 days)
12. Paper Attempt & Assessment: Mar 18-30 (13 days)
