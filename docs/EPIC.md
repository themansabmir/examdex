# Examdex — Epic Requirements Document (ERD)

**Version:** 2.0 | **Date:** February 2026
**Convention:** Each Epic is sized for one fullstack developer to own end-to-end (DB + API + UI) within 5 working days.

---

## Table of Contents

### Auth & Identity

- [Epic 01 — Phone OTP Authentication](#epic-01--phone-otp-authentication)
- [Epic 02 — Google OAuth & Session Management](#epic-02--google-oauth--session-management)

### Onboarding

- [Epic 03 — Student Onboarding Wizard](#epic-03--student-onboarding-wizard)

### Syllabus & Navigation

- [Epic 04 — Syllabus Data Model & Seeding](#epic-04--syllabus-data-model--seeding)
- [Epic 05 — Subject & Topic Browse Experience](#epic-05--subject--topic-browse-experience)

### Paper Generation

- [Epic 06 — Core Paper Generation API](#epic-06--core-paper-generation-api)
- [Epic 07 — LLM Integration & Prompt Engine](#epic-07--llm-integration--prompt-engine)
- [Epic 08 — Paper Generation Mobile UX](#epic-08--paper-generation-mobile-ux)

### Adaptive Engine

- [Epic 09 — Adaptive Difficulty Engine](#epic-09--adaptive-difficulty-engine)

### Paper Taking

- [Epic 10 — Paper Taking Interface](#epic-10--paper-taking-interface)
- [Epic 11 — Paper Submission & Results Screen](#epic-11--paper-submission--results-screen)

### Credits & Payments

- [Epic 12 — Credit Ledger & Deduction System](#epic-12--credit-ledger--deduction-system)
- [Epic 13 — Razorpay Payment Integration](#epic-13--razorpay-payment-integration)
- [Epic 14 — Credit Purchase UI & Transaction History](#epic-14--credit-purchase-ui--transaction-history)

### Analytics

- [Epic 15 — Analytics Data Pipeline](#epic-15--analytics-data-pipeline)
- [Epic 16 — Student Analytics Dashboard UI](#epic-16--student-analytics-dashboard-ui)

### RAG Pipeline

- [Epic 17 — Document Upload & Storage](#epic-17--document-upload--storage)
- [Epic 18 — Document Ingestion Pipeline](#epic-18--document-ingestion-pipeline)
- [Epic 19 — RAG Retrieval Integration](#epic-19--rag-retrieval-integration)

### Prompt Management

- [Epic 20 — Configurable Prompt Templates](#epic-20--configurable-prompt-templates)

### Admin Dashboard

- [Epic 21 — Admin Auth & Dashboard Shell](#epic-21--admin-auth--dashboard-shell)
- [Epic 22 — Student User Management](#epic-22--student-user-management)
- [Epic 23 — Platform Analytics Dashboard](#epic-23--platform-analytics-dashboard)
- [Epic 24 — Credit Pack Management](#epic-24--credit-pack-management)
- [Epic 25 — Content & Prompt Admin UI](#epic-25--content--prompt-admin-ui)
- [Epic 26 — Audit Log](#epic-26--audit-log)

---

## Epic 01 — Phone OTP Authentication

### Functional Requirement

The system must allow a student to register and log in using their Indian mobile number. A 6-digit OTP is sent via SMS, verified server-side, and exchanged for a JWT access token and a rotating refresh token. Rate limiting must prevent abuse.

### Acceptance Criteria

- Student enters a valid +91 mobile number and receives a 6-digit OTP via SMS within 30 seconds.
- OTP expires after exactly 5 minutes; requesting a new OTP invalidates the previous one.
- Entering the correct OTP issues an access token (15-min expiry) and a refresh token (30-day expiry).
- Entering a wrong OTP returns a 401 with a remaining-attempts message.
- After 5 failed attempts within a 10-minute window, the endpoint returns 429 and blocks further attempts for that window.
- Tokens are never stored in plain text on the device (must use secure storage).
- The refresh endpoint issues a new access token and rotates the refresh token on every call.
- Using an expired or revoked refresh token returns 401 and clears the client session.

### Definition of Done

- Unit tests cover OTP hashing, expiry, and rate-limit logic (≥ 80% branch coverage).
- Integration test covers: request OTP → verify → refresh → logout full flow.
- All auth endpoints documented in OpenAPI spec.
- No PII or tokens appear in server logs.
- Tested on Android and iOS simulators.

---

## Epic 02 — Google OAuth & Session Management

### Functional Requirement

The system must support Google OAuth 2.0 as an alternative login method. On successful Google auth, the backend must upsert the user record, handle email collisions with existing phone-auth accounts, and issue the same token pair. The mobile app must silently refresh access tokens without user interruption.

### Acceptance Criteria

- Tapping "Continue with Google" opens the native Google sign-in sheet without a browser redirect.
- A successful Google sign-in creates a new user or links to an existing user with the same email.
- The app silently calls the refresh endpoint before the access token expires and retries the original request transparently.
- On refresh token expiry, the user is redirected to the login screen with a clear message.
- Logging out revokes the refresh token server-side; re-use returns 401.
- Protected API routes return 401 for missing, expired, or tampered tokens.

### Definition of Done

- Google OAuth tested on a physical Android and iOS device (not simulators only).
- Token refresh interceptor tested: simulated expiry triggers a transparent refresh and request retry.
- Logout verified: revoked refresh token returns 401 on re-use.
- Email collision tested: Google account with same email as an existing phone-auth account — both methods work.

---

## Epic 03 — Student Onboarding Wizard

### Functional Requirement

Every new student must complete a 3-step onboarding wizard before accessing the app. The wizard captures target exam, target year, and a self-rated subject baseline. This data seeds the adaptive difficulty engine's initial state. The wizard is shown exactly once and partial completion is persisted so students can resume after closing the app.

### Acceptance Criteria

- Onboarding is triggered on first login and never shown again after completion.
- Step 1: student selects one exam (CUET / JEE / NEET) from tappable cards; proceeding without selection is blocked.
- Step 2: student selects their target year (current year + 2 forward); required to proceed.
- Step 3: student rates their comfort level (1–5) for each subject in their chosen exam.
- A progress indicator is visible throughout all steps.
- Closing the app mid-onboarding resumes from the last saved step on next launch.
- The home screen is fully gated until all three steps are submitted and acknowledged by the server.
- On completion, `student_topic_difficulty` records are seeded for every topic in the selected exam using the baseline ratings.

### Definition of Done

- Gate verified: navigating directly to the home screen without completing onboarding redirects to the wizard.
- Resume verified: close mid-step 2, reopen, land on step 2 with step 1 data intact.
- Baseline scores visible in admin under the student's profile.
- `onboarding_completed` analytics event fires to Firebase with `exam_type` and `target_year`.
- Tested on small (5-inch) and large (6.7-inch) Android screens.

---

## Epic 04 — Syllabus Data Model & Seeding

### Functional Requirement

The system must maintain a structured syllabus tree: Exam → Subject → Chapter → Topic. This tree must be accurately seeded for CUET, JEE, and NEET aligned to current NTA guidelines, and must support CRUD via an admin API.

### Acceptance Criteria

- Database contains `exams`, `subjects`, `chapters`, and `topics` tables with correct foreign key relationships and ordering.
- All three exams are fully seeded with accurate subject, chapter, and topic data.
- A syllabus admin API supports listing, creating, updating, and soft-deleting topics without a code deployment.
- The full syllabus tree for a given exam is fetchable in a single paginated API request.
- The API returns appropriate `Cache-Control` headers for CDN and client-side caching.

### Definition of Done

- Seed data reviewed and signed off by a subject matter expert for all three exams.
- Foreign key integrity tested: correct cascade or block behaviour on deletion.
- Admin CRUD tested: create a topic, rename a chapter, verify changes appear in the student API.
- Tree endpoint tested with all three exam IDs; correct topic counts returned.

---

## Epic 05 — Subject & Topic Browse Experience

### Functional Requirement

Students must navigate from the home screen through subjects to individual topics. Each topic shows the student's last score and last attempt date. Topics are sorted to surface weaknesses first. The syllabus is cached locally for 24 hours and a topic search filter is provided.

### Acceptance Criteria

- Home screen shows subjects for the student's active exam, each with a subject-level average score badge.
- Tapping a subject opens a topic list for that subject.
- Each topic row shows: topic name, last score (or "New"), and last attempted date (or a dash).
- Topics are sorted: weakest score first, then never-attempted, then strongest.
- A debounced (≥ 300ms) search input filters topics by name.
- Syllabus data is cached for 24 hours on-device; subsequent loads within the window do not hit the network.
- Students can change their target exam from the profile screen and the subject list updates immediately.

### Definition of Done

- Sort order verified with three test accounts: no attempts, mixed scores, all attempted.
- Cache verified: disable network, open app within 24 hours — syllabus loads from cache.
- Search tested: query matches mid-word topic names.
- Exam switcher tested: switching exam updates the subject list without a restart.
- Empty states handled with appropriate copy for both no topics and no attempts.

---

## Epic 06 — Core Paper Generation API

### Functional Requirement

The backend must expose an asynchronous paper generation endpoint that atomically validates and deducts one credit, enqueues the generation job, and returns a job ID for polling. A polling endpoint returns status and full paper data on completion. Credits are refunded if generation fails after all retries.

### Acceptance Criteria

- `POST /papers/generate` atomically deducts 1 credit, creates a paper record, enqueues a BullMQ job, and returns `{ jobId, paperId }` with HTTP 202.
- Zero credits returns 402 without any deduction.
- Credit deduction and paper creation occur in a single database transaction — no partial states.
- `GET /papers/job/:jobId` returns `{ status: 'pending' | 'done' | 'failed' }` and full paper payload on completion.
- Only the owning student can poll their job; others receive 403.
- On terminal failure (after retries), credit is refunded and job status is "failed".
- `GET /papers` returns paginated paper history with topic name, score, and date.
- `GET /papers/:id` returns full paper questions and options (without correct answers).

### Definition of Done

- Atomicity tested: simulated DB failure mid-transaction leaves no orphaned records.
- Credit refund tested end-to-end: forced LLM failure restores balance.
- Ownership tested: different student's JWT returns 403 on job polling.
- Load test: 50 concurrent generate requests complete without race conditions on credit balances.
- All endpoints documented in OpenAPI spec.

---

## Epic 07 — LLM Integration & Prompt Engine

### Functional Requirement

The backend must integrate with OpenAI GPT-4o to generate structured question sets. It must construct prompts using the subject's active configurable template with injected difficulty level and RAG context, call the API with retry logic, and validate the JSON response against a strict schema before persisting.

### Acceptance Criteria

- Prompt engine fetches the active template for the subject and injects `{{topic}}`, `{{difficulty}}`, `{{rag_context}}`, and `{{num_questions}}` at runtime.
- OpenAI client uses `response_format: { type: "json_object" }`, model pinned to `gpt-4o`, 8-second timeout.
- On timeout or 5xx, the client retries up to 2 times with exponential backoff.
- JSON validator enforces: array of questions each with `body` (≥ 10 chars), `options` (exactly 4), `correctIndex` (0–3), `explanation` (≥ 20 chars).
- Schema violation triggers a regeneration retry (max 2); then marks generation as failed.
- On success, questions and options are persisted linked to the paper record; status updated to "ready".
- Full rendered prompt is logged at DEBUG level for every generation request.

### Definition of Done

- Unit tests cover schema validation for all failure modes: missing field, wrong type, wrong option count, out-of-range index.
- Retry behaviour tested: mock fails twice then succeeds — paper is created on the third attempt.
- End-to-end smoke test generates a real JEE Physics paper reviewed for quality by a human.
- p95 generation latency measured and confirmed ≤ 4 seconds.

---

## Epic 08 — Paper Generation Mobile UX

### Functional Requirement

The mobile app must provide a clear flow to initiate paper generation, show animated loading feedback during async generation, handle errors gracefully with retry options, and display the paper history list.

### Acceptance Criteria

- Tapping "Generate Paper" on a topic immediately shows a loading screen with an animated indicator.
- App polls `GET /papers/job/:jobId` every 1.5 seconds; navigates to paper-taking screen on "done".
- On "failed", loading is dismissed and a toast shows "Paper generation failed. Your credit has been refunded." with a "Try Again" button.
- Zero credits shows a "Buy Credits" bottom sheet instead of initiating generation.
- Paper History screen shows all past papers sorted by most recent: topic name, score badge, date.
- Tapping a history item navigates to that paper's results screen.

### Definition of Done

- Loading animation tested on a low-end Android device (2GB RAM) for smoothness.
- Error flow tested with a forced backend failure.
- Zero-credit state tested: bottom sheet appears; generate endpoint is not called.
- History tested with 0, 1, and 50+ papers.
- Back navigation from the paper screen goes to the topic screen, not the loading screen.

---

## Epic 09 — Adaptive Difficulty Engine

### Functional Requirement

After every paper submission the system must recalculate the student's difficulty score for the topic using an Exponential Moving Average, automatically promote or demote the student between difficulty bands based on consecutive performance, and make the new score available for the next paper generation. The EMA alpha is configurable without a redeploy.

### Acceptance Criteria

- After each submission, `student_topic_difficulty` is updated: `new_score = α * normalised_score + (1 - α) * old_score`, clamped to 1.0–5.0.
- Default α = 0.3, stored in `app_settings`, changeable by super admin without restart.
- Score maps to bands: 1.0–1.9 = "Foundation", 2.0–2.9 = "NCERT Standard", 3.0–3.9 = "JEE Mains Level", 4.0–4.9 = "JEE Advanced Level", 5.0 = "Expert".
- Scoring ≥ 80% on 3 consecutive papers at the same band promotes to the next band.
- Scoring ≤ 40% on 2 consecutive papers demotes one band (minimum: Foundation).
- Recalculation is asynchronous and does not block result display.
- Every change is written to a `difficulty_audit_log` table.
- Current difficulty band is visible on the topic detail screen.

### Definition of Done

- Unit tests cover EMA for: monotonic improvement, decline, oscillating scores, and boundary values (exactly 80%, 40%).
- Promotion after exactly 3 high scores and demotion after exactly 2 low scores both verified.
- α change via admin confirmed to affect next recalculation without restart.
- Audit log entries verified after each submission.
- Qualitative QA: "Foundation" vs "JEE Advanced Level" papers on the same topic contain visibly different complexity.

---

## Epic 10 — Paper Taking Interface

### Functional Requirement

The system must provide a mobile-native paper-taking screen with a persistent countdown timer, per-question answer selection, question palette navigation, and crash-recovery answer auto-save. The timer must continue accurately when backgrounded and trigger auto-submission on expiry.

### Acceptance Criteria

- Paper screen shows one question at a time with Previous / Next navigation and a question counter.
- Countdown timer is shown at the top; duration configured per exam type in admin.
- Timer continues accurately when the app is backgrounded; correct remaining time shown on return.
- Tapping an answer selects it with visual highlight; tapping again deselects it.
- Each answer selection is auto-saved to the backend within 1 second for crash recovery.
- Question palette shows a grid of question numbers colour-coded: grey (unattempted), green (answered), amber (flagged); tapping navigates to that question.
- When the timer reaches zero the paper is auto-submitted and a toast notifies the student.
- Timer accuracy: ≤ ±2 seconds drift over a 60-minute session.

### Definition of Done

- Timer drift tested: 60-minute session in QA, verified within 2 seconds.
- Background/foreground tested: 5-minute background period; correct time on return.
- Crash recovery tested: kill app mid-paper, reopen, answers from before crash are restored.
- Palette navigation tested with 10, 20, and 30-question papers.
- Tap targets ≥ 44×44pt; text contrast ≥ 4.5:1 (WCAG AA) verified.

---

## Epic 11 — Paper Submission & Results Screen

### Functional Requirement

The system must allow a student to submit their paper with a confirmation dialog, calculate and persist the score server-side, and present a detailed results screen with score, time taken, correct answers, and explanations for every question. A retest CTA must be present.

### Acceptance Criteria

- Tapping "Submit" shows a confirmation: "You have answered X of Y questions." with Review and Confirm options.
- On confirm, answers are submitted, score is calculated server-side, and the results screen is shown.
- Auto-submitted papers (timer expiry) skip the confirmation dialog.
- Results screen shows: score (X/Y), percentage, time taken, and a colour-coded badge (green ≥ 70%, amber 40–69%, red < 40%).
- Scrollable question review shows each question, all four options, selected option, correct option highlighted green, wrong selected highlighted red, and full explanation.
- "Retest This Topic" button triggers a new paper generation for the same topic.
- Results for any past paper are accessible from paper history.

### Definition of Done

- Score calculation verified server-side with all-correct, all-wrong, and partial answer sets.
- Confirmation dialog tested with 0, partial, and fully-answered papers — correct counts shown.
- Auto-submit tested: no confirmation dialog; correct results screen shown.
- Colour badges verified for 0%, 55%, and 100% score scenarios.
- "Retest" navigates to new paper on success.
- Past paper results accessible via the history screen.

---

## Epic 12 — Credit Ledger & Deduction System

### Functional Requirement

The system must maintain a per-student credit balance with a complete immutable ledger of all transactions. Credit deduction during paper generation must be atomic. The balance must be visible in the app at all times, and a push notification must fire when the balance drops to 5 or below.

### Acceptance Criteria

- `credit_balances` holds one row per student with a non-negative integer balance.
- Every credit change is recorded in `credit_transactions` with: type, delta, resulting balance, reference ID, and timestamp.
- Deduction is atomic: a database transaction ensures balance cannot go below 0 and no paper can be created without a matching deduction.
- Student's balance is visible in the app header on every screen.
- When balance drops to 5 or below after a deduction, a local push notification fires once per drop event (not on every subsequent deduction below 5).
- `GET /credits/balance` returns current balance.
- `GET /credits/transactions` returns paginated transaction history.

### Definition of Done

- Concurrency tested: two simultaneous generate requests with balance = 1 result in exactly one success and one 402.
- Ledger integrity verified: sum of all deltas equals current balance for test accounts.
- Push notification tested on Android and iOS: fires on drop to 5, does not fire again on drop to 4.
- Balance widget renders correctly at 0, 1, 5, and 999.
- Transaction history tested with 0, 1, and 50+ entries.

---

## Epic 13 — Razorpay Payment Integration

### Functional Requirement

The system must integrate with Razorpay to allow students to purchase credit packs using UPI, cards, or net banking. Payment initiation is server-side (order creation) and confirmation is via a signed webhook. Webhook processing must be idempotent. Credits are only added after the webhook confirms capture.

### Acceptance Criteria

- `POST /payments/create-order` creates a Razorpay order server-side and returns `{ orderId, amount, keyId }` to the client.
- Razorpay React Native SDK opens natively in-app with UPI, card, and net banking options.
- `POST /webhooks/razorpay` verifies HMAC-SHA256 signature before any processing; invalid signatures return 401.
- On `payment.captured` with valid signature, student balance is incremented and a `payment_records` row is created.
- Duplicate webhook with the same `razorpay_payment_id` returns 200 without crediting again.
- On failure or cancellation, no credits are added and the student sees a clear failure message.
- All payment events logged with: student ID, Razorpay IDs, amount in paise, status, timestamp.

### Definition of Done

- Tested end-to-end in Razorpay test mode for: UPI success, card success, failed payment, and user cancellation.
- Webhook tested for: success, failure, and duplicate success events using Razorpay's simulator.
- Idempotency verified: same success webhook twice → one credit addition, one payment record.
- Tampered payload verified to return 401.
- Switching test to production keys requires only an environment variable change.

---

## Epic 14 — Credit Purchase UI & Transaction History

### Functional Requirement

The mobile app must provide a screen for purchasing credit packs with all active packs displayed clearly. After successful payment, the balance updates immediately. A transaction history screen lists all past credit movements.

### Acceptance Criteria

- Purchase screen shows all active packs from `GET /credit-packs` as tappable cards with name, credit count, and price in INR.
- Tapping a pack initiates `POST /payments/create-order` and opens the Razorpay payment sheet.
- After payment success, the header credit balance updates immediately.
- After failure or cancellation, the student is returned to the purchase screen with a dismissible error.
- Transaction history (accessible from profile) shows: date, type badge (Purchase / Deduction / Refund), delta, and resulting balance.
- Purchase screen is accessible from the zero-credit bottom sheet and from the profile screen.

### Definition of Done

- Purchase tested end-to-end in Razorpay test mode on a physical Android device.
- Balance update after payment confirmed without navigating away.
- Transaction history tested with purchase, deduction, and refund entries all present.
- Zero-credit bottom sheet navigation tested; back returns to the topic screen.
- Deactivated packs are absent from the purchase screen.

---

## Epic 15 — Analytics Data Pipeline

### Functional Requirement

The backend must expose aggregated analytics per student: total papers, overall average, current streak, platform percentile, per-topic score history, and a full topic heatmap. Percentile is only exposed when the platform has sufficient data.

### Acceptance Criteria

- `GET /analytics/summary` returns: `totalPapers`, `overallAverage`, `currentStreak`, `percentile` (null if < 100 qualifying students).
- Streak resets to 0 if no paper was submitted yesterday; increments correctly on consecutive days.
- Percentile is the student's rank among all students with ≥ 3 paper attempts, expressed as a 0–100 float.
- `GET /analytics/topics` returns per-topic: `averageScore`, `attemptCount`, `lastScore`, `currentDifficulty`, and `scoreHistory` (last 10 `{ date, score }` objects).
- `GET /analytics/heatmap` returns all topics for the student's exam with `averageScore` (null if unattempted).
- All endpoints respond within 1.5 seconds with 10,000 papers in the database.

### Definition of Done

- Streak logic verified for: first attempt, two consecutive days, one missed day, and resumed streak.
- Percentile returns null below threshold and correct value above it (tested with seeded data).
- Score history verified: correct chronological order and accurate scores for a known test account.
- Heatmap endpoint returns all exam topics with correct averages.
- Query performance confirmed: all endpoints ≤ 1.5s with 10,000-paper dataset.

---

## Epic 16 — Student Analytics Dashboard UI

### Functional Requirement

The mobile app must present a visual analytics dashboard with summary stat cards, a per-topic score trend line chart, a topic weakness heatmap, and a subject filter. A helpful empty state is shown for new students.

### Acceptance Criteria

- Analytics screen is reachable from the bottom navigation bar.
- Four summary cards: Total Papers, Average Score, Current Streak, Percentile (hidden if null).
- Line chart shows last 10 scores for a topic over time; tapping a point shows a date/score tooltip.
- Heatmap grid shows all topics colour-coded: red (< 50%), amber (50–74%), green (≥ 75%), grey (unattempted).
- Tapping a heatmap tile navigates to that topic's generate paper screen.
- Subject filter (tabs or chips) scopes heatmap and chart to one subject or all.
- Pull-to-refresh re-fetches all analytics data.
- Empty state shown for 0 papers with a "Generate your first paper" CTA.

### Definition of Done

- Line chart renders correctly with 1, 5, and 50+ data points without overflow.
- All four heatmap colour states verified.
- Tapping a tile navigates correctly to the topic screen.
- Percentile card hidden when backend returns null.
- Analytics screen load time ≤ 1.5 seconds on 4G.

---

## Epic 17 — Document Upload & Storage

### Functional Requirement

Admin users must be able to upload PDF and DOCX study material documents tagged to an exam, subject, and topic. Files are stored in S3-compatible object storage and a DB record tracks metadata and processing status.

### Acceptance Criteria

- Upload form requires exam, subject, and topic selection before file can be chosen; Upload is disabled until all three are selected.
- Only PDF and DOCX accepted; other types are rejected before upload with a clear message.
- Files larger than 50MB are rejected client-side before upload begins.
- On success, the raw file is stored in S3 and a `documents` DB record is created with status "pending".
- Uploaded document appears in the topic's document list immediately with a "Processing" badge.
- Deleting a document removes its S3 object and DB record.

### Definition of Done

- Upload tested with 1MB PDF, 30MB PDF, 50MB DOCX, and a 51MB file (rejected).
- Non-PDF/DOCX rejected client-side without starting the upload.
- S3 object verified post-upload: correct key and content type.
- Document appears in list immediately with "Processing" badge.
- Deletion removes both S3 object and DB record.

---

## Epic 18 — Document Ingestion Pipeline

### Functional Requirement

A background pipeline must process uploaded documents by extracting text, chunking it into semantically coherent segments, embedding each chunk via OpenAI, and upserting to Pinecone with metadata. The pipeline must complete within 15 minutes for a 50MB document, handle failures with retries, and update document status at each stage.

### Acceptance Criteria

- A BullMQ job is enqueued immediately on document upload.
- Worker extracts text from PDF (pdf-parse) and DOCX (mammoth); corrupt files are marked "failed" with a descriptive error.
- Text chunked using `RecursiveCharacterTextSplitter`: chunk_size=512, chunk_overlap=50.
- Each chunk embedded via OpenAI `text-embedding-3-small` in batches of up to 100.
- Vectors upserted to Pinecone with metadata: `exam`, `subject`, `topic`, `document_id`, `chunk_index`.
- Document status updates to "indexed" with correct `chunk_count` on success.
- Failures retry up to 3 times with exponential backoff; then marked "failed".
- Partial upserts are rolled back by document_id delete before re-attempting.
- Full pipeline completes within 15 minutes for a 50MB document.

### Definition of Done

- End-to-end smoke test: upload a 30-page NCERT PDF → confirm chunks in Pinecone with correct metadata.
- Corrupt PDF marks document "failed" with a human-readable error.
- Retry logic tested: two failures then success → document reaches "indexed".
- Deletion removes all vectors from Pinecone.
- 15-minute SLA validated with a 50MB document.

---

## Epic 19 — RAG Retrieval Integration

### Functional Requirement

The paper generation engine must query Pinecone at generation time to retrieve the most relevant document chunks for the selected topic and inject them as context into the LLM prompt. If no documents exist for a topic, generation proceeds normally with an empty context.

### Acceptance Criteria

- RAG retrieval service accepts a `topicId` and returns the top-5 most relevant chunks as a formatted context string.
- Retrieval uses a semantic query embedding matched against Pinecone with a `topic` metadata filter.
- Retrieved context is injected into `{{rag_context}}` in the prompt template.
- If no documents exist for a topic, `{{rag_context}}` is filled with an empty string and generation proceeds normally.
- Retrieval adds ≤ 500ms to overall generation latency.
- Retrieved chunks are logged at DEBUG level alongside the paper ID for traceability.

### Definition of Done

- Retrieval tested with a topic that has indexed documents: returned chunks are topically relevant (human reviewed).
- Fallback tested with a topic with no documents: generation completes with empty context.
- Retrieval latency confirmed ≤ 500ms at p95.
- Generated paper with RAG context reviewed end-to-end: questions reference uploaded document content.

---

## Epic 20 — Configurable Prompt Templates

### Functional Requirement

The system must store AI prompt templates per subject in the database and allow super admin users to edit them via the admin dashboard. Changes take effect immediately on the next generation request without redeploy. Full version history is preserved.

### Acceptance Criteria

- Every subject has exactly one active prompt template at all times.
- Required variables `{{topic}}`, `{{difficulty}}`, `{{rag_context}}`, `{{num_questions}}` must all be present; saving without any returns 422 naming the missing variable.
- Saving a new version deactivates the previous (sets `is_active = false`) but does not delete it.
- Active template is fetched from DB on every generation call (no in-memory cache).
- Admin editor highlights `{{variable}}` syntax and provides a variable reference guide.
- "Preview" button interpolates sample values and shows the rendered prompt in a read-only modal.
- Only `super_admin` role can save changes; `admin` role can only view.

### Definition of Done

- Version history verified: three saves result in four DB records with correct `is_active` flags.
- Runtime effect tested: edit a template, generate a paper, confirm new template text in the generation log.
- Validation tested for each of the four missing variable scenarios individually.
- RBAC tested: `admin` role PUT returns 403; `super_admin` succeeds.
- Preview renders correctly with all variables substituted.

---

## Epic 21 — Admin Auth & Dashboard Shell

### Functional Requirement

The admin dashboard must be a separate web application with its own email + password authentication, role-based access control (Admin and Super Admin), and a consistent navigation shell. Student credentials cannot access the dashboard.

### Acceptance Criteria

- Admin login accepts email + password; uses bcrypt for verification.
- Sessions managed via HTTP-only, SameSite=Strict cookies with 8-hour expiry.
- Two roles: `admin` (content and user management) and `super_admin` (all features including pricing and prompt editing).
- Sidebar navigation shows only sections the logged-in role has access to.
- Accessing a restricted route directly via URL returns a 403 page.
- Student JWTs are rejected by admin middleware and return 401.
- All admin pages share a consistent layout: sidebar, top bar with admin email and role badge, and a logout button.

### Definition of Done

- Login tested with correct credentials, wrong password, and unknown email.
- RBAC tested: `admin` role cannot reach pricing or prompt pages via direct URL (403 page, not just hidden nav).
- Student JWT rejected by admin middleware.
- Session expiry tested: cookie invalid after 8 hours; redirected to login.
- Logout clears session cookie and redirects to login.

---

## Epic 22 — Student User Management

### Functional Requirement

Admin users must be able to search student accounts, view full student profiles including paper history and credit balance, and disable or re-enable accounts. Disabled accounts are immediately blocked from the student API.

### Acceptance Criteria

- Search input filters students by phone or email (fires after ≥ 3 characters).
- Results shown in a paginated table (25 per page): name, phone, exam, credit balance, status badge.
- Tapping a student opens a detail page: onboarding data, last 10 papers with scores and dates, last 10 credit transactions, current balance, and an Active/Disabled toggle.
- Toggle shows a confirmation dialog before actioning; disabling immediately revokes all student refresh tokens.
- A disabled student's next API request returns 403 with "Account suspended."
- Re-enabling restores full access on next login.

### Definition of Done

- Search tested with phone and email partial matches.
- Pagination tested with 0, 1, and 100+ students.
- Disable tested: API call with student token after disable returns 403.
- Re-enable tested: student logs in again and has full access.
- Detail page data verified against database for a known test account.

---

## Epic 23 — Platform Analytics Dashboard

### Functional Requirement

The admin dashboard must display real-time platform metrics: daily active users, papers generated, revenue, and user growth trends. Data must be accurate and refreshable.

### Acceptance Criteria

- Headline cards show: DAU (distinct students with a submission today), papers generated today, total revenue to date in INR.
- Line chart shows DAU for last 7 days and last 30 days (toggle between views).
- Bar chart shows credit pack sales breakdown (count per pack type) for the last 30 days.
- All data auto-refreshes every 5 minutes; a manual Refresh button is available.
- Dashboard figures match raw database counts within ±1 minute of freshness.

### Definition of Done

- DAU count verified against raw `papers` table distinct student IDs for today.
- Revenue figure cross-validated against `payment_records` sum for a known test dataset.
- 7-day and 30-day DAU charts verified with seeded submission data.
- Auto-refresh confirmed: new data inserted, dashboard updates within 5 minutes.
- Dashboard loads within 2 seconds on a standard connection.

---

## Epic 24 — Credit Pack Management

### Functional Requirement

Super admin users must be able to create, edit, and deactivate credit packs. Changes must be reflected in the student app's purchase screen within 60 seconds. At least one active pack must always exist.

### Acceptance Criteria

- Pack management screen lists all packs with: name, credits, price in INR, and Active/Inactive status.
- "Create Pack" opens a form with required fields: name, credit amount (positive integer), price in INR (positive number).
- Existing active packs can be edited; deactivated packs cannot be edited.
- Deactivating a pack hides it from `GET /credit-packs` within 60 seconds.
- Deactivating the last active pack is blocked with a clear error message.
- All pack mutations are logged to the audit log.

### Definition of Done

- Create tested: new pack appears in student purchase screen within 60 seconds.
- Edit tested: price change reflected in student app within 60 seconds.
- Deactivate tested: pack disappears from student purchase screen within 60 seconds.
- Last-pack guard tested: returns a clear error.
- Form validation tested: empty name, zero price, negative credits all blocked.

---

## Epic 25 — Content & Prompt Admin UI

### Functional Requirement

The admin dashboard must provide a unified interface for uploading study material and editing per-subject prompt templates. Both features are accessible from the admin sidebar and connect to the Epic 17/18/20 backends.

### Acceptance Criteria

- "Content Management" sidebar contains sub-pages: Document Upload and Prompt Configuration.
- Document upload form: cascading exam/subject/topic dropdowns, file picker (PDF/DOCX, 50MB limit), Upload button.
- Document list shows all documents for the selected topic with filename, status badge (auto-polling for processing docs), chunk count, and Delete button with confirmation.
- Prompt Configuration page lists all subjects with current template version, last updated date, and an Edit button (hidden for `admin`, visible for `super_admin`).
- Edit opens a full-screen modal with multi-line editor, `{{variable}}` syntax highlighting, variable reference sidebar, Preview button, and Save button.
- Save shows a success toast; validation errors shown inline.

### Definition of Done

- Upload flow tested end-to-end: upload → processing badge → indexed badge with chunk count.
- Status badge auto-updates without manual page refresh.
- Delete removes document from list and triggers Pinecone cleanup.
- Prompt edit tested: save, generate a paper, confirm new template was used.
- `admin` role: Edit absent; `super_admin`: Edit present and functional.

---

## Epic 26 — Audit Log

### Functional Requirement

Every sensitive admin action must be recorded in an immutable audit log. The log must be viewable and filterable from the admin dashboard. No entries can be deleted or edited.

### Acceptance Criteria

- The following actions each produce an audit log entry: user disable, user enable, prompt template update, credit pack create/edit/deactivate, document delete, admin login.
- Each entry contains: timestamp, acting admin's email and role, action type, resource type, resource ID, and a metadata JSON snapshot of changed values.
- Audit log screen shows entries in reverse chronological order, paginated at 50 per page.
- Filter controls for: date range, admin user, and action type.
- No DELETE or PUT endpoint exists for audit records; attempting to call one returns 405.
- Accessible to both `admin` and `super_admin` roles.

### Definition of Done

- All six action types verified: each produces an entry with correct field values.
- Pagination tested with 0, 1, and 200+ entries.
- All three filter types tested: each returns correct subsets.
- Append-only verified: no delete or edit endpoint exists in the API spec.
- Metadata snapshot verified: prompt update entry contains old and new template body.

---

_End of ERD.md_

---

| Field        | Value                      |
| ------------ | -------------------------- |
| Document     | Epic Requirements Document |
| Product      | Examdex                    |
| Version      | 2.0 — 26 Epics             |
| Last Updated | February 2026              |
