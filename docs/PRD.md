# Examdex — Product Requirements Document

**Version:** 1.0 | **Status:** Draft | **Date:** February 2026
**Prepared for:** Internal Engineering & Design Teams
**Classification:** Confidential

---

## AI Stack Recommendation (Pre-Read)

Before diving into requirements, here is the recommended AI approach for Examdex, given the "undecided" input:

**Recommended: OpenAI GPT-4o via API + a vector database (Pinecone or Weaviate) for the RAG pipeline.**

The reasoning is straightforward. GPT-4o has the strongest out-of-the-box performance on STEM reasoning tasks (JEE/NEET-type MCQs require multi-step physics, chemistry, and mathematics reasoning), supports structured JSON output natively for reliable question formatting, and has predictable latency suitable for a mobile UX. For the RAG pipeline, Pinecone is the fastest path to production for a small team and integrates cleanly with LangChain, which also handles the configurable per-subject prompt templating requirement elegantly. This combination avoids the infra overhead of self-hosting while keeping costs predictable and controllable via the credit system.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Audience](#2-target-audience)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Stories](#4-user-stories)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Out of Scope — V1](#7-out-of-scope--v1)
8. [Epic Breakdown](#8-epic-breakdown)
9. [Task-Level Breakdown](#9-task-level-breakdown)

---

## 1. Problem Statement

Indian competitive exam aspirants (JEE, NEET, CUET) face a fragmented and inefficient preparation ecosystem. Existing platforms offer static mock tests that do not adapt to a student's evolving strengths and weaknesses. Students waste time re-practising topics they have already mastered while neglecting weaker areas, leading to poor time efficiency and exam-day underperformance.

Simultaneously, educators and platform operators lack a flexible, configurable system to keep study material current — syllabus changes, new question patterns, and updated textbook content must be reflected in generated papers without requiring engineering effort every time.

**Core pain points being addressed:**

- Static, non-adaptive mock tests do not reflect real learning gaps.
- No single platform covers CUET, JEE, and NEET with topic-level granularity.
- Operators cannot update AI knowledge base or prompts without code changes.
- Students have no clear, data-backed feedback loop to improve performance.

---

## 2. Target Audience

### Primary Persona — The Aspirant

**Name:** Rohan, 17, Class 12 student, Tier-2 city (Lucknow)
**Goal:** Clear JEE Mains with a score above 95 percentile.
**Behaviour:** Studies 6–8 hours daily, uses mobile as the primary device, price-sensitive, motivated by progress metrics and leaderboards.
**Pain:** Buys expensive coaching but has no tool to identify which specific topics within Physics or Maths are dragging his score down. Standard mock tests give a score, not a diagnosis.

### Secondary Persona — The Admin / Content Manager

**Name:** Priya, 31, Ed-tech Ops at Examdex
**Goal:** Keep the AI's knowledge base updated with latest NCERT chapters, PYQ (Previous Year Questions) sets, and NTA guidelines without filing an engineering ticket.
**Behaviour:** Non-technical, comfortable with web dashboards, uploads PDFs and Word docs.
**Pain:** Today, any content change requires a developer. She needs a self-serve pipeline.

### Tertiary Persona — The Super Admin / Business Owner

**Name:** Amit, 38, Founder
**Goal:** Monitor platform health, control credit pricing, manage user growth, and tune AI prompt behaviour per subject.
**Behaviour:** Checks dashboards daily, needs to act on anomalies quickly (e.g., a bad prompt producing wrong answers in Chemistry).

---

## 3. Goals & Success Metrics

### Product Goals

- Launch a closed beta with CUET, JEE, and NEET support within the defined V1 scope.
- Demonstrate measurable improvement in student performance over repeated sessions.
- Build a self-serve content ingestion pipeline that reduces operator dependency on engineering.
- Establish a sustainable credit-based monetisation loop.

### KPI Table

| KPI                      | Target                                                                          | Measurement Source          |
| ------------------------ | ------------------------------------------------------------------------------- | --------------------------- |
| Activation Rate          | ≥ 60% of registered users complete onboarding and attempt 1 paper within 7 days | Firebase Analytics          |
| Engagement               | DAU/MAU ratio ≥ 25% within 90 days of launch                                    | Firebase Analytics          |
| Adaptive Accuracy        | Difficulty calibration error < 0.15 (0–1 scale) after 3 attempts per topic      | Internal ML metrics         |
| Credit Conversion        | ≥ 8% of free users purchase a credit pack within 30 days                        | Razorpay + backend logs     |
| Paper Quality            | Average in-app paper rating ≥ 4.2 / 5                                           | In-app rating widget        |
| 30-Day Retention         | ≥ 35%                                                                           | Firebase Analytics          |
| Paper Generation Latency | ≤ 4 seconds p95                                                                 | Backend APM (e.g., Datadog) |
| Admin Upload-to-Live     | New material available in RAG pipeline within 15 minutes of upload              | Internal pipeline logs      |

---

## 4. User Stories

### Authentication & Onboarding

- As a new student, I want to sign up with my phone number or Google account, so that I can access the platform quickly without creating a new password.
- As a new student, I want to go through a guided onboarding flow that asks me which exam I am preparing for, so that the platform is configured to my specific needs from day one.
- As a returning student, I want my session to persist across app restarts, so that I do not have to log in repeatedly on my phone.

### Exam & Topic Selection

- As a student, I want to select my target exam (CUET / JEE / NEET) from a clear menu, so that I only see relevant subjects and topics.
- As a student, I want to drill down into a specific subject (e.g., Physics) and then a specific topic (e.g., Laws of Motion), so that I can focus my practice on one area at a time.
- As a student, I want to see my performance history for each topic before generating a new paper, so that I can make an informed decision about what to practise next.

### AI Paper Generation

- As a student, I want to generate a practice paper on a selected topic with one tap, so that I can start practising immediately without manual question selection.
- As a student, I want the AI to automatically increase question difficulty when I am consistently performing well on a topic, so that I am always being challenged appropriately.
- As a student, I want to take the paper with a countdown timer that mirrors real exam conditions, so that I build time management skills.
- As a student, I want to see detailed answer explanations after submitting a paper, so that I understand why each answer is correct or incorrect.
- As a student, I want to request a retest paper on a topic where I previously underperformed, so that I can measure my improvement.

### Credits & Payments

- As a student, I want to see my current credit balance prominently in the app, so that I am always aware of how many papers I can still generate.
- As a student, I want to purchase a credit pack using UPI, debit card, or net banking, so that I can top up quickly using the payment methods I already use.
- As a student, I want to receive a notification when my credit balance falls below 5, so that I am not caught off guard mid-session.

### Analytics

- As a student, I want to see a dashboard showing my score trends per topic over time, so that I can track my improvement.
- As a student, I want to see a weakness heatmap across all topics in my chosen exam, so that I know where to focus next.

### Admin — Content Management

- As an admin, I want to upload PDF or Word documents for a specific subject, so that the RAG pipeline can ingest the new material without involving an engineer.
- As an admin, I want to configure the AI prompt template for each subject separately, so that the tone, question format, and difficulty calibration instructions can be fine-tuned per subject without a code deployment.
- As an admin, I want to see the status of each uploaded document (processing / indexed / failed), so that I know the material is live before announcing it to students.

### Admin — Platform Management

- As a super admin, I want to manage credit pack pricing and bundle definitions, so that I can run promotions without a code change.
- As a super admin, I want to view platform-wide analytics (active users, papers generated, revenue), so that I can monitor business health daily.
- As a super admin, I want to disable or re-enable any student account, so that I can act on abuse or payment disputes quickly.

---

## 5. Functional Requirements

**FR-01 — Authentication:** The system must support sign-up and login via OTP (SMS) and OAuth 2.0 (Google). JWT-based session management with refresh tokens.

**FR-02 — Onboarding:** A multi-step onboarding wizard must collect exam preference, target year, and baseline self-assessment. This data seeds the adaptive model's initial difficulty setting.

**FR-03 — Exam & Syllabus Configuration:** The system must maintain a structured syllabus tree: Exam → Subject → Chapter → Topic. This tree must be manageable from the admin dashboard.

**FR-04 — AI Paper Generation:** On user request, the backend must construct a prompt (using the subject's configured prompt template + relevant RAG context), call the LLM API, parse the structured JSON response, persist the paper, and return it to the app — all within the 4-second p95 SLA.

**FR-05 — Adaptive Engine:** After each paper submission, the system must recalculate the student's difficulty score for each attempted topic using a weighted rolling average of recent scores. The next paper request for that topic must use this updated difficulty score in the prompt.

**FR-06 — Timer:** Each paper session must enforce a configurable countdown timer. On expiry, the session must auto-submit with answers recorded up to that point.

**FR-07 — Answer & Explanation Delivery:** After submission, the system must present the correct answer and a detailed explanation for every question.

**FR-08 — Retest:** Students must be able to generate a new paper on any topic they have previously attempted. The retest paper must use updated difficulty based on their latest performance.

**FR-09 — Credit System:** Each paper generation deducts one credit. Credits are non-expiring. The system must enforce that a student cannot generate a paper with zero credits.

**FR-10 — Payments:** Razorpay integration must support UPI, cards, and net banking. On payment success (webhook confirmation), the system must credit the student's account immediately. On failure, no credits are added.

**FR-11 — Analytics — Student:** The app must display score trend graphs per topic, a weakness heatmap, and a summary of total papers attempted, average score, and estimated percentile.

**FR-12 — RAG Pipeline:** The admin must be able to upload documents (PDF, DOCX) via the dashboard. The system must chunk, embed, and index the content into the vector database. New content must be queryable within 15 minutes of upload completion.

**FR-13 — Configurable Prompts:** Per-subject prompt templates must be stored in the database and editable via the admin dashboard. Changes must take effect on the next paper generation request without a service restart.

**FR-14 — Admin Dashboard:** A web-based dashboard providing content management, user management, credit and pricing configuration, and platform analytics.

---

## 6. Non-Functional Requirements

### Security

- All API communication must use HTTPS/TLS 1.2+.
- Passwords (if any) must be hashed with bcrypt (cost factor ≥ 12). OTP codes must expire within 5 minutes.
- JWT access tokens must expire within 15 minutes; refresh tokens within 30 days.
- Razorpay webhook payloads must be verified using the Razorpay signature header before crediting accounts.
- The admin dashboard must be protected by role-based access control (RBAC) with at minimum two roles: Admin and Super Admin.
- User PII (phone, email) must be stored encrypted at rest.

### Performance

- Paper generation end-to-end: ≤ 4 seconds at p95 under normal load.
- API response time for non-AI endpoints: ≤ 300ms at p95.
- App cold start: ≤ 3 seconds on a mid-range Android device (e.g., Redmi Note 11).
- RAG document indexing: ≤ 15 minutes from upload to queryable.

### Scalability

- The backend must be stateless and horizontally scalable via container orchestration (Docker + Kubernetes or a managed equivalent like AWS ECS).
- The database must support at least 100,000 active student records and 1,000,000 paper records in V1 without schema changes.
- LLM API calls must be queued (e.g., via Redis or BullMQ) to handle burst traffic gracefully and avoid rate-limit errors.

### Reliability

- Backend service uptime target: 99.5% monthly.
- Payment webhook processing must be idempotent — duplicate webhook events must not result in double crediting.
- All background jobs (document ingestion, embedding) must have retry logic with exponential backoff (max 3 retries).

### Accessibility & Internationalisation

- The student app must support English and Hindi in V1.
- Text must scale with system font size settings (no fixed pixel sizes for body text).

---

## 7. Out of Scope — V1

The following are explicitly deferred to V2 or later and must not be built in V1:

| Feature                                      | Reason Deferred                                            |
| -------------------------------------------- | ---------------------------------------------------------- |
| Web app for students                         | Mobile-first strategy; web adds significant frontend scope |
| Live tutoring / doubt resolution             | Requires tutor ops infrastructure                          |
| Social features (leaderboards, peer groups)  | Focus on core product loop first                           |
| Offline mode                                 | Requires significant caching architecture; adds complexity |
| Stripe / international payments              | India-only market for V1                                   |
| In-app purchases (Apple / Google Play)       | Avoids 30% platform fee; Razorpay is sufficient for V1     |
| Custom exam creation by students             | Nice-to-have; not core to V1 value proposition             |
| Parent / guardian accounts                   | Secondary persona; not in critical path                    |
| Video content or lectures                    | Out of Examdex's AI paper-generation positioning           |
| Push notifications (beyond low-credit alert) | Scope reduction; one notification type only in V1          |

---

## 8. Epic Breakdown

---

### Epic 1 — Authentication & Session Management

**Functional Requirement:** The system must allow students to register and authenticate via SMS OTP or Google OAuth, and maintain secure, persistent sessions using JWT tokens.

**Acceptance Criteria:**

- A new user can sign up with a valid Indian mobile number (+91); an OTP is delivered within 30 seconds.
- OTP is exactly 6 digits and expires in 5 minutes; a second attempt invalidates the first.
- A user can alternatively sign up / log in with a Google account (OAuth 2.0 flow).
- On successful authentication, the app receives an access token (15-min expiry) and a refresh token (30-day expiry).
- The app automatically refreshes the access token using the refresh token without requiring the user to log in again.
- On refresh token expiry, the user is redirected to the login screen with a clear message.
- All auth endpoints return appropriate HTTP status codes (200, 401, 422) and standardised error messages.
- Failed OTP attempts are rate-limited to 5 attempts per 10-minute window per phone number.

**Definition of Done:**

- Unit tests cover OTP generation, expiry, and rate limiting logic (≥ 80% coverage).
- Integration tests cover the full signup → token → refresh → logout flow.
- Google OAuth tested on both iOS and Android simulators.
- Security review completed: no tokens stored in plain text, no PII in logs.
- API documented in Postman / OpenAPI spec.

---

### Epic 2 — Onboarding Flow

**Functional Requirement:** The system must guide new students through a structured multi-step onboarding flow that captures exam selection, target year, and self-assessed baseline, then uses this data to initialise the adaptive difficulty engine.

**Acceptance Criteria:**

- Onboarding is triggered automatically after first successful authentication and only once per account.
- Step 1 presents the three exam options (CUET, JEE, NEET) as tappable cards; only one can be selected.
- Step 2 asks for target exam year (current year + next 2 years).
- Step 3 presents a short self-assessment (3–5 questions) to calibrate starting difficulty per subject.
- A progress indicator shows the user which step they are on.
- Users cannot skip onboarding; the home screen is gated until completion.
- Onboarding data is persisted to the backend before the user proceeds to the home screen.
- Re-opening the app mid-onboarding resumes from the last completed step (state is persisted).

**Definition of Done:**

- All three onboarding steps render correctly on Android (API 26+) and iOS (15+).
- Self-assessment answers are stored against the student profile and visible in the admin dashboard.
- UX reviewed by at least one non-technical stakeholder; all copy is signed off.
- Onboarding completion event is fired to analytics.

---

### Epic 3 — Exam, Subject & Topic Selection

**Functional Requirement:** The system must provide a navigable, hierarchical interface for students to select their exam, subject, and topic, and must display per-topic performance history alongside each topic to inform selection.

**Acceptance Criteria:**

- The home screen shows the student's selected exam and a list of subjects relevant to that exam.
- Tapping a subject opens a topic list for that subject.
- Each topic card shows: topic name, last attempted date (or "Not attempted yet"), and last score (or dash).
- A student can change their target exam from profile settings; this updates the subject and topic list accordingly.
- The topic list supports search/filter by topic name.
- Topics are ordered by: weakest first (lowest last score), then by never attempted, then by strongest.
- The syllabus data (exam → subject → topic hierarchy) is fetched from the backend and cached locally for 24 hours.

**Definition of Done:**

- Syllabus tree is seeded for all three exams (CUET, JEE, NEET) with accurate chapter and topic breakdowns aligned to current NTA syllabus.
- Performance data correctly reflects the student's actual paper history.
- Navigation tested across screen sizes (small: 5-inch, large: 6.7-inch).
- Empty states (no attempts yet) are handled gracefully with helpful copy.

---

### Epic 4 — AI Paper Generation Engine

**Functional Requirement:** The system must, on student request, generate a contextually accurate, syllabus-aligned practice paper for a selected topic using a configurable per-subject prompt template combined with relevant RAG-retrieved context, returning a structured set of questions within the latency SLA.

**Acceptance Criteria:**

- Tapping "Generate Paper" on a topic deducts 1 credit and triggers paper generation.
- If the student has 0 credits, the "Generate Paper" button is disabled and a "Buy Credits" prompt is shown.
- The paper contains between 10 and 30 questions (configurable per exam type in admin).
- Each question has: question text, 4 answer options (MCQ), correct answer index, and explanation text — all returned as structured JSON.
- Questions are syllabus-accurate for the selected topic and exam; hallucinated or off-topic questions must be caught by a validation layer.
- The system uses the student's current difficulty score for the topic to parameterise question difficulty in the prompt.
- End-to-end paper generation (request received → paper returned to app) completes within 4 seconds at p95.
- If the LLM API call fails or times out, the student's credit is not deducted and a clear error message is shown.
- Generated papers are persisted to the database and accessible in the student's history indefinitely.

**Definition of Done:**

- LLM integration tested with mocked and live API calls; error handling tested for timeout, rate limit, and malformed response scenarios.
- JSON schema validation applied to every LLM response before persisting; malformed responses trigger a retry (max 2 retries).
- Credit deduction is atomic with paper creation — no partial states (credit deducted but no paper, or paper created but credit not deducted).
- Load test: 50 concurrent paper generation requests complete within SLA.
- At least 20 sample papers per subject manually reviewed for quality by a subject matter expert before launch.

---

### Epic 5 — Adaptive Difficulty Engine

**Functional Requirement:** The system must maintain and continuously update a per-student, per-topic difficulty score, and use this score to modulate the difficulty of future generated papers for that topic.

**Acceptance Criteria:**

- After a student submits a paper, the system calculates a performance score (percentage correct, weighted by question difficulty).
- The topic difficulty score is updated using an Exponential Moving Average (EMA) with a configurable decay factor (default α = 0.3, adjustable in admin).
- The updated difficulty score is reflected in the next paper generation prompt for that topic.
- Difficulty scores range from 1 (beginner) to 5 (advanced) and are mapped to prompt difficulty descriptors (e.g., "foundation," "intermediate," "JEE Advanced level").
- A student who scores ≥ 80% on 3 consecutive papers at a given difficulty level is automatically promoted to the next level.
- A student who scores ≤ 40% on 2 consecutive papers is demoted one level.
- The student can see their current difficulty level per topic in the analytics screen.
- Difficulty scores are recalculated synchronously after submission but paper display does not wait for recalculation.

**Definition of Done:**

- Adaptive algorithm is unit tested with simulated score sequences covering edge cases (all correct, all wrong, alternating, rapid improvement).
- The EMA decay factor is stored in configuration (not hardcoded) and changeable without a deploy.
- Difficulty changes are logged to an audit table for debugging and ML improvement.
- QA verifies that two sequential papers on the same topic at different difficulty levels contain noticeably different question complexity.

---

### Epic 6 — Paper-Taking Interface (Timer, Submission, Review)

**Functional Requirement:** The system must provide a mobile-native paper-taking interface with a countdown timer, question navigation, answer selection, auto-submit on timeout, and a post-submission review screen with scores and explanations.

**Acceptance Criteria:**

- The paper screen displays one question at a time with a swipe or "Next / Previous" navigation.
- A countdown timer is displayed at the top; duration is set per exam type (e.g., JEE: 3 hours for full paper, 20 minutes for topic drill).
- The timer persists if the app is backgrounded; on return, the correct remaining time is shown.
- Tapping an answer option selects it and visually highlights it; tapping again deselects.
- Students can navigate to any question via a question palette (numbered grid).
- Tapping "Submit" shows a confirmation dialog summarising unattempted questions before final submission.
- On timer expiry, the paper is auto-submitted; a toast notification informs the student.
- The review screen shows: total score, percentage, time taken, and a question-by-question breakdown with correct answer and explanation.
- A "Retest this Topic" CTA is shown on the review screen.

**Definition of Done:**

- Timer accuracy tested: no more than ±2 seconds drift over a 60-minute session.
- Auto-submit tested by letting timer expire in QA; correct state persisted.
- Review screen renders correctly for papers with 10, 20, and 30 questions.
- Accessibility: tap targets ≥ 44x44pt; contrast ratio ≥ 4.5:1 for all text.
- Tested on low-end Android device (2GB RAM) for jank-free performance.

---

### Epic 7 — Credit System & Razorpay Payments

**Functional Requirement:** The system must enforce a credit-based gate on paper generation, provide in-app credit pack purchasing via Razorpay, and handle payment success and failure states reliably and idempotently.

**Acceptance Criteria:**

- Credit balance is visible in the app header / profile screen at all times.
- Credit packs are defined in admin (e.g., 10 credits for ₹99, 30 credits for ₹249, 100 credits for ₹699).
- Tapping a pack opens the Razorpay payment sheet (native SDK) supporting UPI, cards, and net banking.
- On payment success, the Razorpay webhook fires to the backend; after signature verification, credits are added to the student's account within 5 seconds.
- On payment failure or cancellation, no credits are added and the student sees an appropriate message.
- Duplicate webhook events (same payment ID) do not result in double crediting (idempotency key enforced).
- The student receives an in-app notification and (optionally) a transaction confirmation screen after a successful purchase.
- All transactions are logged to a payments ledger table with: student ID, payment ID, amount, credits purchased, timestamp, and status.

**Definition of Done:**

- Razorpay test mode used throughout development; switch to live mode is a single environment variable change.
- Webhook handler tested with Razorpay's test event simulator for success, failure, and duplicate event scenarios.
- Payment ledger is queryable from the admin dashboard.
- Refund flow is documented (manual process for V1, no automated refunds).
- Security: webhook endpoint validates Razorpay signature on every request; unauthenticated requests return 401.

---

### Epic 8 — Student Analytics Dashboard

**Functional Requirement:** The system must present each student with a personalised analytics dashboard showing score trends over time, a weakness heatmap across all topics, and summary performance statistics.

**Acceptance Criteria:**

- The analytics screen is accessible from the bottom navigation bar.
- A line graph shows the student's average score per topic over their last 10 attempts (per topic).
- A heatmap view shows all topics colour-coded by average score (red = weak, amber = improving, green = strong).
- Summary statistics shown: total papers attempted, overall average score, current streak (consecutive days with at least one paper), and estimated percentile (based on platform-wide data).
- Data refreshes when the student navigates to the analytics screen (pull-to-refresh also available).
- Filters allow viewing analytics for a specific subject or all subjects.
- Empty state shown for new students with 0 attempts, with a CTA to generate their first paper.

**Definition of Done:**

- Charts render correctly with 1, 5, and 50+ data points.
- Percentile calculation uses a minimum sample of 100 platform users; below that threshold, the percentile field is hidden.
- Analytics data is aggregated server-side; the app does not perform heavy computation.
- Performance: analytics screen loads in ≤ 1.5 seconds on a standard connection.

---

### Epic 9 — RAG Pipeline & Content Ingestion (Admin)

**Functional Requirement:** The system must allow admin users to upload study material documents (PDF, DOCX) tagged to a specific exam, subject, and topic; the pipeline must automatically chunk, embed, and index the content into the vector database, making it available for RAG-augmented paper generation within 15 minutes.

**Acceptance Criteria:**

- The admin dashboard has an "Upload Material" section where the admin selects exam, subject, and topic before uploading.
- Supported file types: PDF and DOCX. Maximum file size: 50MB per upload.
- After upload, the document enters a processing queue and the admin sees a status indicator: Uploading → Processing → Indexed (or Failed with error reason).
- The pipeline chunks documents into segments of approximately 512 tokens with 10% overlap.
- Each chunk is embedded using the configured embedding model (OpenAI `text-embedding-3-small` recommended) and stored in the vector database (Pinecone) with metadata: exam, subject, topic, document ID, chunk index.
- When a paper is generated, the top-5 most relevant chunks for the selected topic are retrieved and injected into the LLM prompt as context.
- Previously uploaded documents for a topic can be listed and deleted from the admin dashboard; deletion removes the chunks from the vector database.
- Failed ingestion jobs notify the admin via a dashboard alert (no email required in V1).

**Definition of Done:**

- End-to-end tested: upload a 30-page NCERT chapter PDF, verify chunks appear in Pinecone, generate a paper, and confirm RAG context is present in the LLM prompt (via logging).
- Chunking strategy reviewed and validated by a subject matter expert to ensure chunks are semantically coherent.
- Deletion tested: after deleting a document, its chunks no longer appear in retrieval results.
- Pipeline failure (e.g., corrupt PDF) handled gracefully with clear error status in admin UI; retries logged.
- Indexing latency tested: 15-minute SLA validated for a 50MB document.

---

### Epic 10 — Configurable Prompt Management (Admin)

**Functional Requirement:** The system must allow admin users to view and edit the AI prompt template for each subject via the admin dashboard, with changes taking effect immediately on the next paper generation request without requiring a code deployment or service restart.

**Acceptance Criteria:**

- Each subject has one active prompt template stored in the database.
- The admin dashboard has a "Prompt Configuration" section listing all subjects with an Edit button for each.
- The template editor is a multi-line text editor with syntax highlighting for template variables (e.g., `{{topic}}`, `{{difficulty}}`, `{{rag_context}}`, `{{num_questions}}`).
- A list of supported template variables is shown alongside the editor.
- The admin can preview how the rendered prompt looks with sample values before saving.
- Saving a new template creates a versioned record; the previous template is not deleted (audit trail).
- The system uses the latest active template version at runtime; no cache invalidation delay.
- Invalid templates (e.g., missing required variables) are rejected on save with a descriptive error message.

**Definition of Done:**

- Template versioning verified: editing and saving twice results in 3 records (original + 2 versions) with correct timestamps.
- Runtime test: edit the Physics template, generate a paper, and confirm the new template text appears in the LLM request log.
- Required variable validation tested with templates missing each required variable.
- RBAC enforced: only Super Admin role can edit prompt templates; standard Admin can only view.

---

### Epic 11 — Admin Dashboard — Platform Management

**Functional Requirement:** The system must provide a web-based admin dashboard for user management, platform analytics, and credit pack pricing configuration.

**Acceptance Criteria:**

- The admin dashboard is a web application accessible at a separate domain (e.g., admin.examdex.in).
- Login is restricted to admin-role users; standard student credentials do not work.
- User Management: admin can search users by phone/email, view their profile, paper history, and credit balance, and disable/re-enable their account.
- Platform Analytics: shows daily active users (DAU), papers generated per day, total revenue, and credit pack breakdown — all with a 7-day and 30-day view.
- Credit Pack Management: admin can create, edit, and deactivate credit packs (name, credit amount, price in INR). Changes are reflected in the student app within 60 seconds.
- All admin actions (user disable, prompt edit, pack pricing change) are logged to an audit log with timestamp and acting admin's user ID.

**Definition of Done:**

- Dashboard is responsive for desktop (1280px+) and tablet (768px+); mobile support not required for V1.
- RBAC tested: Super Admin sees all sections; Admin cannot access Prompt Configuration or Pricing.
- Audit log tested: every sensitive action generates a log entry viewable in a dedicated audit log screen.
- Platform analytics figures cross-validated against raw database counts for accuracy.

---

## 9. Task-Level Breakdown

---

### Epic 1 — Authentication & Session Management

| #    | Task Title                                    | Description                                                                                                                        |
| ---- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1.1  | Design user and session database schema       | Define `users`, `otp_codes`, and `refresh_tokens` tables with indexes on phone number and token hash.                              |
| 1.2  | Build OTP generation and SMS delivery service | Implement 6-digit OTP generation, store hashed OTP with 5-minute TTL, integrate with an SMS gateway (e.g., MSG91 or Twilio India). |
| 1.3  | Build OTP verification API endpoint           | `POST /auth/verify-otp` — validates OTP, creates user if new, returns access + refresh token pair.                                 |
| 1.4  | Implement Google OAuth 2.0 server-side flow   | Exchange Google auth code for profile data, upsert user record, return token pair. Handle email-phone account collision.           |
| 1.5  | Implement JWT access token middleware         | Backend middleware that validates access token on every protected route; returns 401 on expiry or invalid signature.               |
| 1.6  | Build token refresh endpoint                  | `POST /auth/refresh` — validates refresh token, issues new access token; rotates refresh token on each use.                        |
| 1.7  | Build logout endpoint                         | `POST /auth/logout` — invalidates the current refresh token in the database.                                                       |
| 1.8  | Implement OTP rate limiting                   | Redis-backed rate limiter: max 5 OTP attempts per phone number per 10-minute window; return 429 on breach.                         |
| 1.9  | Build React Native auth screens               | Login screen (phone input + OTP entry) and Google Sign-In button. Handle loading, error, and success states.                       |
| 1.10 | Implement secure token storage on device      | Store tokens using `expo-secure-store` (iOS Keychain / Android Keystore); never store in AsyncStorage.                             |

---

### Epic 2 — Onboarding Flow

| #   | Task Title                                 | Description                                                                                                                               |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Design onboarding data schema              | Add `onboarding_completed`, `target_exam`, `target_year`, and `baseline_scores` fields to the `users` table.                              |
| 2.2 | Build onboarding state persistence API     | `POST /onboarding/progress` — saves partial onboarding state so users can resume after app close.                                         |
| 2.3 | Build onboarding completion API            | `POST /onboarding/complete` — marks onboarding done, triggers adaptive engine initialisation for selected exam.                           |
| 2.4 | Build Step 1 UI — Exam Selection           | React Native screen with three tappable exam cards (CUET, JEE, NEET) with icons. Selection state persisted locally and synced to backend. |
| 2.5 | Build Step 2 UI — Target Year Selection    | Dropdown or segmented control for year selection. Validates selection before allowing navigation to Step 3.                               |
| 2.6 | Build Step 3 UI — Baseline Self-Assessment | Display 3–5 difficulty-rating questions per subject. Collect responses and POST to onboarding API.                                        |
| 2.7 | Build onboarding gate in app navigation    | Navigation logic checks `onboarding_completed` on app load; redirects to onboarding wizard if false.                                      |
| 2.8 | Fire onboarding completion analytics event | On successful onboarding completion, fire a `onboarding_completed` event to Firebase Analytics with exam type and target year.            |

---

### Epic 3 — Exam, Subject & Topic Selection

| #   | Task Title                             | Description                                                                                                                                          |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Seed syllabus database                 | Populate `exams`, `subjects`, `chapters`, and `topics` tables with full NTA syllabus data for CUET, JEE, and NEET.                                   |
| 3.2 | Build syllabus API endpoints           | `GET /exams/:id/subjects` and `GET /subjects/:id/topics` — return hierarchical syllabus data with student performance metadata per topic.            |
| 3.3 | Implement 24-hour local syllabus cache | Cache syllabus API responses on-device using React Query or similar; serve from cache on subsequent loads.                                           |
| 3.4 | Build Home Screen — Subject List       | React Native screen showing subject cards for the student's selected exam; each card shows a subject-level average score badge.                      |
| 3.5 | Build Topic List Screen                | Screen showing all topics for a subject; each row shows topic name, last attempted date, and last score. Sorted by weakest first.                    |
| 3.6 | Implement topic search / filter        | Debounced search input on the topic list screen that filters topics by name client-side.                                                             |
| 3.7 | Build exam switcher in Profile         | Allow students to switch their target exam from the profile screen; on change, reset exam-specific performance data display (do not delete history). |

---

### Epic 4 — AI Paper Generation Engine

| #    | Task Title                                    | Description                                                                                                                                                  |
| ---- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.1  | Design paper and question database schema     | Define `papers`, `questions`, `answer_options`, and `student_answers` tables. Papers link to student, topic, and difficulty score at generation time.        |
| 4.2  | Build paper generation API endpoint           | `POST /papers/generate` — validates credits, enqueues generation job, returns job ID immediately (async pattern).                                            |
| 4.3  | Implement credit deduction with atomic lock   | Use a database transaction to check-and-deduct credits atomically; prevent race conditions on concurrent requests.                                           |
| 4.4  | Build LLM prompt construction service         | Service that retrieves the subject's active prompt template, injects topic, difficulty, num_questions, and RAG context, and renders the final prompt string. |
| 4.5  | Integrate OpenAI GPT-4o API                   | API client with retry logic (2 retries, exponential backoff), timeout (8 seconds), and structured JSON output mode enabled.                                  |
| 4.6  | Build JSON response parser and validator      | Parse LLM response; validate schema (question text, 4 options, correct index, explanation all present); reject and retry on schema violation.                |
| 4.7  | Build paper polling endpoint                  | `GET /papers/job/:jobId` — returns job status (pending / complete / failed) and paper data when complete. App polls this every 1 second.                     |
| 4.8  | Implement credit refund on generation failure | If the LLM call fails after all retries, restore the deducted credit and return a failure status to the app.                                                 |
| 4.9  | Build "Generate Paper" UI flow                | Tapping the button triggers the API, shows a loading indicator (animated), polls for completion, and navigates to the paper-taking screen on success.        |
| 4.10 | Build paper history list screen               | Screen showing all past papers for the student, sorted by most recent, with topic name, score, and date.                                                     |

---

### Epic 5 — Adaptive Difficulty Engine

| #   | Task Title                                | Description                                                                                                                                                                                   |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Design difficulty score schema            | Add `student_topic_difficulty` table: student ID, topic ID, current difficulty score (1.0–5.0), attempt count, last updated.                                                                  |
| 5.2 | Implement EMA difficulty recalculation    | Post-submission service that computes the new difficulty score using EMA (α = 0.3 default) and persists it. Runs asynchronously after submission.                                             |
| 5.3 | Implement promotion and demotion rules    | Check consecutive scores after each update; promote if ≥ 80% on 3 consecutive papers; demote if ≤ 40% on 2 consecutive.                                                                       |
| 5.4 | Store configurable EMA alpha in settings  | α value stored in an `app_settings` table, editable from admin dashboard, loaded at runtime.                                                                                                  |
| 5.5 | Map difficulty score to prompt descriptor | Lookup table mapping score ranges (1.0–1.9 = "foundation", 2.0–2.9 = "NCERT standard", 3.0–3.9 = "JEE Mains level", 4.0–4.9 = "JEE Advanced level", 5.0 = "expert") injected into the prompt. |
| 5.6 | Log difficulty change events              | Write every difficulty score change to a `difficulty_audit_log` table with old score, new score, paper ID, and timestamp.                                                                     |

---

### Epic 6 — Paper-Taking Interface

| #   | Task Title                                            | Description                                                                                                                                                        |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6.1 | Build paper-taking screen layout                      | React Native screen displaying question text, 4 answer option buttons, question number, and countdown timer at the top.                                            |
| 6.2 | Implement countdown timer with background persistence | Use `AppState` API to track when the app is backgrounded; on foreground restore, calculate elapsed time and resume from correct remaining time.                    |
| 6.3 | Build question palette                                | Slide-up modal showing a numbered grid of all questions colour-coded by status (not attempted / attempted / flagged); tapping a number navigates to that question. |
| 6.4 | Implement answer selection state                      | Local state tracking selected answer per question; persist to backend on each answer selection for crash recovery.                                                 |
| 6.5 | Build auto-submit on timer expiry                     | When timer reaches zero, trigger the submission flow automatically, show a toast, and navigate to the results screen.                                              |
| 6.6 | Build submission confirmation dialog                  | "Submit Paper?" dialog showing count of attempted vs. unattempted questions; two CTAs: "Review" (dismiss) and "Submit" (confirm).                                  |
| 6.7 | Build paper submission API endpoint                   | `POST /papers/:id/submit` — accepts answer array, calculates score, persists results, triggers adaptive engine recalculation.                                      |
| 6.8 | Build results / review screen                         | Screen showing overall score, percentage, time taken, and a scrollable question list with correct answer highlighted and explanation shown below each question.    |
| 6.9 | Add "Retest this Topic" CTA                           | Button on results screen that calls `POST /papers/generate` for the same topic and navigates to the new paper on success.                                          |

---

### Epic 7 — Credit System & Razorpay Payments

| #    | Task Title                             | Description                                                                                                                                                            |
| ---- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7.1  | Design credits and payments schema     | `credit_balances` (student ID, balance), `credit_transactions` (ledger with type: purchase/deduction/refund), `payment_records` (Razorpay payment ID, amount, status). |
| 7.2  | Build credit balance API               | `GET /credits/balance` — returns current balance. `POST /credits/deduct` and `POST /credits/refund` — internal-only endpoints called by the paper generation service.  |
| 7.3  | Build credit pack management API       | `GET /credit-packs` — returns active packs (ID, name, credits, price in paise). Sourced from admin-configurable `credit_packs` table.                                  |
| 7.4  | Integrate Razorpay React Native SDK    | Initialise Razorpay order via backend, open payment sheet in-app, handle success/failure callbacks.                                                                    |
| 7.5  | Build Razorpay order creation endpoint | `POST /payments/create-order` — creates a Razorpay order server-side and returns the order ID to the app.                                                              |
| 7.6  | Build Razorpay webhook handler         | `POST /webhooks/razorpay` — verifies HMAC signature, checks idempotency (payment ID not already processed), credits student account, logs transaction.                 |
| 7.7  | Implement payment idempotency          | Before crediting, check `payment_records` for existing entry with same Razorpay payment ID; if found, skip and return 200 (already processed).                         |
| 7.8  | Build low-credit push notification     | Trigger a local push notification (via `expo-notifications`) when balance drops to 5 or below after a paper deduction.                                                 |
| 7.9  | Build credit purchase UI               | Screen showing credit pack options as tappable cards with pack name, credit count, and price. Tapping initiates the Razorpay flow.                                     |
| 7.10 | Build transaction history screen       | List of all credit transactions for the student: date, type (purchase / paper deduction), amount, and balance after transaction.                                       |

---

### Epic 8 — Student Analytics Dashboard

| #   | Task Title                           | Description                                                                                                                                                           |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8.1 | Build analytics data aggregation API | `GET /analytics/summary` — returns: total papers, average score, current streak, and estimated percentile. `GET /analytics/topics` — returns per-topic score history. |
| 8.2 | Implement percentile calculation     | Server-side: calculate student's average score rank among all students who have attempted ≥ 3 papers. Return null if platform sample < 100 students.                  |
| 8.3 | Build analytics home screen          | Summary cards (total papers, average score, streak, percentile) at the top, followed by subject filter tabs.                                                          |
| 8.4 | Build score trend line chart         | Use `react-native-svg` or `victory-native` to render a line chart of score over last 10 attempts per topic. Tapping a point shows date and score in a tooltip.        |
| 8.5 | Build weakness heatmap               | Grid of all topics colour-coded by average score (red / amber / green). Tapping a topic navigates to the topic detail and generate paper screen.                      |
| 8.6 | Implement subject filter             | Tab bar or chip selector to filter analytics view by subject; "All" tab shows cross-subject heatmap.                                                                  |
| 8.7 | Build empty state for new students   | Friendly empty state illustration with copy "Generate your first paper to start tracking progress" and a CTA button.                                                  |

---

### Epic 9 — RAG Pipeline & Content Ingestion

| #   | Task Title                         | Description                                                                                                                                                                                        |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9.1 | Set up Pinecone index              | Create a Pinecone index with 1536 dimensions (matching OpenAI `text-embedding-3-small` output); configure metadata fields: exam, subject, topic, document_id, chunk_index.                         |
| 9.2 | Build document upload API          | `POST /admin/documents/upload` — accepts multipart file upload (PDF/DOCX, max 50MB), stores raw file in S3-compatible storage, creates a `documents` DB record with status "pending".              |
| 9.3 | Build document ingestion worker    | Background worker (BullMQ job) that: extracts text from PDF/DOCX, chunks into ~512-token segments with 10% overlap, embeds each chunk via OpenAI, upserts to Pinecone with metadata.               |
| 9.4 | Implement chunking strategy        | Use LangChain's `RecursiveCharacterTextSplitter` with chunk_size=512, chunk_overlap=50, and separators prioritising paragraph and sentence boundaries.                                             |
| 9.5 | Build document status polling API  | `GET /admin/documents/:id/status` — returns current ingestion status: pending / processing / indexed / failed with error message if failed.                                                        |
| 9.6 | Build RAG retrieval service        | Service that, given a topic ID, queries Pinecone for the top-5 most relevant chunks, and returns formatted context string for prompt injection.                                                    |
| 9.7 | Build document list and delete API | `GET /admin/documents?topic_id=X` — lists all documents for a topic. `DELETE /admin/documents/:id` — deletes DB record and removes all associated Pinecone vectors by document_id metadata filter. |
| 9.8 | Implement ingestion retry logic    | On chunk embedding or upsert failure, retry with exponential backoff (max 3 attempts); mark document as "failed" after exhausting retries and log the error.                                       |

---

### Epic 10 — Configurable Prompt Management

| #    | Task Title                                | Description                                                                                                                                                                            |
| ---- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10.1 | Design prompt templates schema            | `prompt_templates` table: ID, subject_id, template_body (text), version (integer), is_active (boolean), created_by, created_at.                                                        |
| 10.2 | Seed default prompt templates             | Write and insert default prompt templates for all subjects across CUET, JEE, and NEET. Templates include all required variables.                                                       |
| 10.3 | Build prompt retrieval service            | Backend service that fetches the latest active prompt template for a given subject from DB at runtime (no in-memory cache to ensure immediacy of changes).                             |
| 10.4 | Build prompt template CRUD API            | `GET /admin/prompts?subject_id=X`, `PUT /admin/prompts/:subject_id` — create a new version on update; previous version is preserved with is_active set to false.                       |
| 10.5 | Build template variable validator         | On save, verify all required variables (`{{topic}}`, `{{difficulty}}`, `{{rag_context}}`, `{{num_questions}}`) are present in the template; return 422 with specific error if missing. |
| 10.6 | Build prompt editor UI in admin dashboard | Textarea with monospace font, line numbers, and colour-coded highlighting for `{{variable}}` patterns. Variable reference guide shown in a sidebar.                                    |
| 10.7 | Build prompt preview feature              | "Preview" button renders the template with sample values and displays the final prompt string in a read-only modal.                                                                    |
| 10.8 | Enforce RBAC on prompt endpoints          | Middleware check: only users with the `super_admin` role can call PUT /admin/prompts; standard `admin` role receives 403.                                                              |

---

### Epic 11 — Admin Dashboard — Platform Management

| #     | Task Title                      | Description                                                                                                                                                 |
| ----- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11.1  | Scaffold admin web app          | Next.js (or React + Vite) project with authentication, routing, and a shared sidebar layout. Deploy to a separate subdomain.                                |
| 11.2  | Build admin authentication      | Email + password login for admin users (separate from student auth). bcrypt password hashing; session managed via HTTP-only cookie.                         |
| 11.3  | Implement RBAC middleware       | Middleware that checks the logged-in admin's role before serving each protected route; returns 403 for insufficient permissions.                            |
| 11.4  | Build user management screen    | Search bar + paginated table of users. Each row: name, phone, exam, credit balance, account status. Action buttons: View Profile, Disable / Enable Account. |
| 11.5  | Build user detail page          | Shows student's full profile, last 10 papers (with scores), credit transaction history, and account status toggle.                                          |
| 11.6  | Build platform analytics screen | Cards for DAU, papers generated today, total revenue to date. Line charts for DAU (7-day and 30-day). Bar chart for credit pack sales breakdown.            |
| 11.7  | Build credit pack management UI | Table of existing packs with Edit and Deactivate actions. "Create Pack" form: name, credit amount, price in INR. Changes persist immediately.               |
| 11.8  | Build audit log screen          | Paginated table of all admin actions with: timestamp, acting admin, action type, and affected resource ID. Filterable by admin and action type.             |
| 11.9  | Build document management UI    | Upload interface with file picker, exam/subject/topic selectors, and status badge per uploaded document. Delete button with confirmation dialog.            |
| 11.10 | Build prompt configuration UI   | List of subjects with current prompt template preview and Edit button. Opens the prompt editor modal (see Epic 10 tasks).                                   |

---

_End of Document_

---

**Document Control**

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Product      | Examdex                            |
| Version      | 1.0                                |
| Status       | Draft — Pending Engineering Review |
| Author       | AI-assisted PRD (Claude)           |
| Last Updated | February 2026                      |
| Next Review  | Prior to Sprint 1 kickoff          |
