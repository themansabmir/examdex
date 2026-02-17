# Examdex — Task Breakdown

**Version:** 2.0 | **Date:** February 2026
**Convention:** Every task is ≤ 1 hour of focused work, independently completable, and specifies the layer it touches in brackets: [DB] [BE] [Mobile] [Web] [Infra].

---

## Epic 01 — Phone OTP Authentication

**E01-T01** [DB] Create `users` table migration
Define `users` with id (UUID PK), phone (unique nullable), email (unique nullable), is_active (bool), created_at, updated_at. Add indexes on phone and email.

**E01-T02** [DB] Create `otp_codes` table migration
Define `otp_codes` with id, user_id (FK), code_hash (bcrypt of the 6-digit code), expires_at, used (bool), created_at. Index on user_id.

**E01-T03** [DB] Create `refresh_tokens` table migration
Define `refresh_tokens` with id, user_id (FK), token_hash (unique), expires_at, revoked (bool), created_at. Index on token_hash.

**E01-T04** [BE] Build OTP generation and SMS dispatch service
Generate a cryptographically random 6-digit code, bcrypt-hash it, persist it to `otp_codes`, and call the SMS gateway (MSG91 or Twilio India) with the plaintext code.

**E01-T05** [BE] Build `POST /auth/request-otp` endpoint
Accept a +91 phone number, validate E.164 format, invalidate any existing unused OTPs for that number, call the OTP service, and return 200. Reject with 429 if the Redis rate-limit counter exceeds 5 requests per 10 minutes for that phone.

**E01-T06** [BE] Build `POST /auth/verify-otp` endpoint
Accept phone + code, fetch the latest unused unexpired OTP for that phone, bcrypt-compare the code, and on match upsert the user record and issue an access + refresh token pair. Return 401 on any mismatch.

**E01-T07** [BE] Implement JWT access token issuance utility
Sign a JWT with `{ sub: userId, role: 'student' }` and a 15-minute expiry using HS256 with an environment-variable secret. Expose a reusable `signAccessToken(userId)` function consumed by all auth endpoints.

**E01-T08** [BE] Implement refresh token issuance and storage utility
Generate a 256-bit random string, hash it, store the hash in `refresh_tokens` with 30-day expiry, and return the plaintext token. Expose `issueRefreshToken(userId)` for reuse across auth flows.

**E01-T09** [BE] Build `POST /auth/refresh` endpoint
Accept a refresh token, find the matching hash in `refresh_tokens`, verify it is not revoked or expired, issue a new access token, and rotate the refresh token (revoke old, issue new). Return both tokens.

**E01-T10** [BE] Build `POST /auth/logout` endpoint and JWT middleware
The logout endpoint revokes the current refresh token. The middleware extracts the Bearer token, verifies and decodes it, and attaches `req.user` to every protected route; returns 401 on invalid or expired tokens.

**E01-T11** [Mobile] Build phone number input screen
React Native screen with a +91 pre-filled phone input, a "Send OTP" button, loading and error states. On submit call `POST /auth/request-otp` and navigate to the OTP entry screen on success.

**E01-T12** [Mobile] Build OTP entry screen
Six-cell OTP input that auto-advances, auto-submits on the last digit, shows a countdown to OTP expiry, and has a "Resend OTP" link that appears after 30 seconds. Calls `POST /auth/verify-otp` on completion.

**E01-T13** [Mobile] Implement secure token storage and silent refresh interceptor
Store access and refresh tokens using `expo-secure-store` (never AsyncStorage). Add an Axios interceptor that silently calls `POST /auth/refresh` on a 401 response, retries the original request once, and redirects to login on refresh failure.

---

## Epic 02 — Google OAuth & Session Management

**E02-T01** [BE] Build Google OAuth token exchange endpoint
Accept a Google `id_token` from the client, verify it with Google's public keys, extract sub/email/name, upsert the user, and handle the case where the email already exists on a phone-auth account by linking the Google ID to that user.

**E02-T02** [Mobile] Integrate Google Sign-In SDK and OAuth flow
Install `@react-native-google-signin/google-signin`, add a "Continue with Google" button to the login screen, retrieve the `id_token` on tap, POST it to the backend, and handle cancelled or network-failed states gracefully.

**E02-T03** [Mobile] Add Google Sign-In to the login screen UI
Update the login screen layout to include the Google button below the phone input section, with correct spacing and the official Google branding button component. Handle the disabled state while an auth call is in flight.

---

## Epic 03 — Student Onboarding Wizard

**E03-T01** [DB] Add onboarding fields to `users` and create `baseline_scores` table
Migration adds `onboarding_completed` (bool), `target_exam` (enum), `target_year` (smallint), `onboarding_step` (smallint) to `users`. Creates `baseline_scores` with user_id, subject_id, self_rating (1–5).

**E03-T02** [BE] Build onboarding step-save and status endpoints
`POST /onboarding/step` persists partial state per step and updates `onboarding_step` on the user. `GET /onboarding/status` returns `{ completed, currentStep, data }` so the app knows where to resume on launch.

**E03-T03** [BE] Build onboarding completion endpoint and difficulty seeding service
`POST /onboarding/complete` marks `onboarding_completed = true` and calls the seeding service, which creates `student_topic_difficulty` rows for every topic in the selected exam, mapping baseline ratings to initial difficulty scores.

**E03-T04** [BE] Build baseline questions config endpoint
`GET /onboarding/questions?exam=JEE` returns the 3–5 self-assessment questions for the selected exam's subjects. Questions are stored in a config table, not hardcoded, so they can be updated without a deploy.

**E03-T05** [Mobile] Build onboarding navigation guard
On app launch after auth, call `GET /onboarding/status`. If `completed = false`, redirect to the wizard at `currentStep`; if `completed = true`, proceed to the home screen. Implemented as a root-level navigation check.

**E03-T06** [Mobile] Build Step 1 — Exam Selection screen
Three tappable exam cards (CUET, JEE, NEET) with icons and short descriptors. Selection highlighted with a border/colour change. "Next" button disabled until one is selected; on tap POST step 1 data and advance.

**E03-T07** [Mobile] Build Step 2 — Target Year screen
Segmented control or large radio buttons for current year, +1, and +2. "Next" disabled until selected. On tap POST step 2 data and advance. Progress indicator shows step 2 of 3.

**E03-T08** [Mobile] Build Step 3 — Baseline Self-Assessment screen
Render subject-difficulty rating questions fetched from the config endpoint. Each question uses a 1–5 star or slider rating. "Complete Setup" button POSTs all ratings and calls the completion endpoint, then navigates to home.

---

## Epic 04 — Syllabus Data Model & Seeding

**E04-T01** [DB] Create syllabus schema tables
Migrations for `exams`, `subjects` (with exam_id FK, icon_url), `chapters` (with subject_id FK, order_index), and `topics` (with chapter_id FK, order_index). All with `created_at` and `is_active` soft-delete columns.

**E04-T02** [DB] Write CUET syllabus seed script
Seed script that inserts all CUET subjects, chapters, and topics aligned to current NTA CUET guidelines. Idempotent: uses upsert on a unique name + parent constraint so it can be re-run safely.

**E04-T03** [DB] Write JEE syllabus seed script
Seed script for JEE Mains + Advanced covering Physics, Chemistry, and Mathematics with all chapters and topics. Same idempotent upsert pattern as the CUET seed.

**E04-T04** [DB] Write NEET syllabus seed script
Seed script for NEET covering Physics, Chemistry, Botany, and Zoology with all NTA-aligned chapters and topics. Idempotent upsert pattern.

**E04-T05** [BE] Build syllabus read API endpoints
`GET /exams` returns all exams. `GET /exams/:id/subjects` returns subjects with chapter and topic counts. `GET /subjects/:id/topics` returns all topics for a subject. All responses include `Cache-Control: max-age=86400`.

**E04-T06** [BE] Build syllabus admin CRUD endpoints
`POST /admin/syllabus/topics`, `PUT /admin/syllabus/topics/:id`, and `DELETE /admin/syllabus/topics/:id` (soft delete). Only accessible to admin+ roles. Changes invalidate the CDN cache key for affected exam/subject combinations.

---

## Epic 05 — Subject & Topic Browse Experience

**E05-T01** [BE] Augment topics endpoint with student performance metadata
Extend `GET /subjects/:id/topics` to include per-topic `lastScore`, `lastAttemptedAt`, and `currentDifficulty` for the authenticated student. Use a single LEFT JOIN against `papers` and `student_topic_difficulty` for performance.

**E05-T02** [BE] Build subject-level average score endpoint
Extend `GET /exams/:id/subjects` to include the authenticated student's average score per subject (AVG of all paper scores for topics within that subject). Return null if no attempts.

**E05-T03** [Mobile] Build Home Screen — Subject grid
React Native screen showing subject cards for the student's active exam. Each card shows subject name, icon, and an average score badge ("Start" if unattempted). Tapping navigates to the topic list for that subject.

**E05-T04** [Mobile] Build Topic List screen with sort and performance data
Screen listing all topics for a subject. Each row: topic name, last score badge (green/amber/red or "New"), and last attempted date. Topics sorted client-side: weakest first, never-attempted next, strongest last.

**E05-T05** [Mobile] Implement topic search with debouncing and caching
Add a debounced (300ms) search input above the topic list. On input, filter the locally cached topic list by name (case-insensitive). Clear button restores the full list. Powered by React Query with `staleTime: 24h`.

**E05-T06** [Mobile] Build exam switcher in Profile screen
Profile screen section "My Exam" with a "Change" button. Opens a modal with three exam options. On selection, PATCH `/users/me` with the new exam, clear the syllabus cache, and navigate back to the home screen with the updated subject list.

---

## Epic 06 — Core Paper Generation API

**E06-T01** [DB] Create `papers` table migration
Define `papers` with id (UUID), student_id (FK), topic_id (FK), status (enum: generating/ready/failed), difficulty_score_at_generation (float), submitted_at, score (smallint), time_taken_seconds, auto_submitted (bool), created_at.

**E06-T02** [DB] Create `questions`, `answer_options`, and `generation_jobs` tables
`questions`: id, paper_id (FK), body, explanation, correct_option_index (0–3), order_index. `answer_options`: id, question_id (FK), body, option_index. `generation_jobs`: id, paper_id (FK), status, error_message, timestamps.

**E06-T03** [BE] Build atomic credit deduction service
Opens a DB transaction with FOR UPDATE lock on `credit_balances`. If balance ≥ 1, deducts 1 and inserts a deduction ledger entry. If 0, throws `InsufficientCreditsError` and rolls back. No partial states possible.

**E06-T04** [BE] Build `POST /papers/generate` endpoint
Validates auth and credits. Calls atomic deduction. Creates `papers` (status: generating) and `generation_jobs` (status: pending) records. Enqueues a BullMQ job with `paperId`. Returns `{ jobId, paperId }` as HTTP 202.

**E06-T05** [BE] Build credit refund service
Atomically increments `credit_balances.balance` by 1 and inserts a "refund" ledger entry. Idempotent: checks for an existing refund row with the same `paper_id` before executing. Called by the generation worker on terminal failure.

**E06-T06** [BE] Build `GET /papers/job/:jobId` polling endpoint
Returns `{ status, paperId }` for a job. When status is "done", includes the full paper payload (questions + options, no correct answers). Enforces ownership: only the owning student can poll; others receive 403.

**E06-T07** [BE] Build `GET /papers` history endpoint
Returns paginated paper history for the authenticated student: paper ID, topic name, score (null if incomplete), created_at, and status. Sorted by most recent. Default page size 20.

**E06-T08** [BE] Build `GET /papers/:id` endpoint
Returns the full paper with all questions and answer options but without correct indices or explanations. Auth and ownership enforced. Used to resume or review a paper before submission.

---

## Epic 07 — LLM Integration & Prompt Engine

**E07-T01** [BE] Build OpenAI GPT-4o API client wrapper
Wraps the OpenAI Node SDK with: model pinned to `gpt-4o`, `response_format: { type: "json_object" }`, 8-second timeout, and retry logic (2 retries, exponential backoff) on 429 and 5xx responses.

**E07-T02** [BE] Build prompt construction service
Fetches the subject's active prompt template from DB, the student's current difficulty descriptor, and the RAG context string. Interpolates all four required variables and returns the final prompt string. Logs the rendered prompt at DEBUG level.

**E07-T03** [BE] Build LLM response JSON schema validator
Defines a Zod schema for the expected response: array of question objects each with `body`, `options` (4 strings), `correctIndex` (0–3), `explanation`. Throws a typed `SchemaValidationError` on any violation; the caller decides whether to retry.

**E07-T04** [BE] Build paper generation BullMQ worker
Picks up jobs from the `paper-generation` queue. Calls the prompt construction service, the OpenAI client, and the schema validator. On success: persists questions and options, sets paper status to "ready". On terminal failure: calls the credit refund service and sets paper status to "failed".

**E07-T05** [BE] Implement question and option persistence service
Receives the validated array of question objects and a `paperId`. Bulk-inserts question rows and their answer option rows in a single transaction. Returns the count of persisted questions.

---

## Epic 08 — Paper Generation Mobile UX

**E08-T01** [Mobile] Build "Generate Paper" button state and credit gate
On the topic detail screen, the "Generate Paper" button is enabled when credits > 0 and disabled (showing "Buy Credits") when credits = 0. Tapping with 0 credits opens the buy-credits bottom sheet; tapping with credits starts generation.

**E08-T02** [Mobile] Build generation loading screen with polling
Full-screen loading overlay with a branded animated indicator. Starts polling `GET /papers/job/:jobId` every 1.5 seconds on mount. Navigates to the paper-taking screen on "done"; navigates back and shows an error toast on "failed".

**E08-T03** [Mobile] Build generation error state and retry flow
On a "failed" job status, dismiss the loading screen, show a toast: "Paper generation failed. Your credit has been refunded." with a "Try Again" button. Tapping "Try Again" re-initiates the full generate → poll flow.

**E08-T04** [Mobile] Build Paper History list screen
Scrollable list of all past papers from `GET /papers`, sorted by most recent. Each row: topic name, subject badge, score badge (colour-coded or "Incomplete"), and date. Tapping a row navigates to the results screen for that paper.

**E08-T05** [Mobile] Handle back navigation after paper generation
Ensure the back stack after generation is clean: pressing back from the paper-taking screen returns to the topic detail screen, not to the loading screen. Implement by replacing the loading screen in the navigation stack rather than pushing on top of it.

---

## Epic 09 — Adaptive Difficulty Engine

**E09-T01** [DB] Create `student_topic_difficulty` table migration
Define `student_topic_difficulty` with student_id (FK), topic_id (FK), difficulty_score (float 1.0–5.0), consecutive_high (smallint), consecutive_low (smallint), attempt_count, last_updated. Unique constraint on (student_id, topic_id).

**E09-T02** [DB] Create `difficulty_audit_log` table and `app_settings` table
`difficulty_audit_log`: student_id, topic_id, paper_id (FK), old_score, new_score, trigger type, created_at. `app_settings`: key (varchar PK), value (text), updated_by, updated_at. Seed with `ema_alpha = '0.3'`.

**E09-T03** [BE] Implement EMA recalculation service
Given studentId, topicId, and a normalised paper score (0.0–1.0), fetch current difficulty and α from `app_settings`, apply `new = α * score + (1-α) * old`, clamp to 1.0–5.0, persist, and write an audit log entry.

**E09-T04** [BE] Implement promotion and demotion rule checker
After EMA update, check `consecutive_high` (≥ 3 → promote one band) and `consecutive_low` (≥ 2 → demote one band). Band promotion/demotion adjusts the difficulty_score to the floor of the next/previous band. Resets the streak counters on any change.

**E09-T05** [BE] Build difficulty-to-descriptor mapping utility and async job wiring
Pure function mapping difficulty_score ranges to prompt descriptor strings ("Foundation", "JEE Mains Level" etc.). Wire the EMA service and promotion checker into a BullMQ `difficulty-recalc` worker, enqueued by the paper submission endpoint.

**E09-T06** [BE] Build `GET /app-settings` and `PUT /app-settings/:key` admin endpoints
GET returns the current value of a settings key. PUT validates `ema_alpha` is a float between 0.05 and 0.95, updates the row, and logs the change to the admin audit log. Super admin auth required.

**E09-T07** [Mobile] Display topic difficulty level on topic detail screen
Below the topic name on the topic detail screen, show the current difficulty band label (e.g., "Level: JEE Mains Level") fetched from the topic list endpoint. Refresh after returning from a completed paper submission.

---

## Epic 10 — Paper Taking Interface

**E10-T01** [DB] Create `student_answers` table migration
Define `student_answers` with id, paper_id (FK), question_id (FK), selected_option_index (smallint, nullable), saved_at. Unique constraint on (paper_id, question_id) to ensure upsert semantics.

**E10-T02** [BE] Build `POST /papers/:id/answers/:questionId` auto-save endpoint
Upserts a single answer for a given question within a paper. Auth and ownership enforced. Does not change paper status. Used for crash recovery; returns 200 with the saved state.

**E10-T03** [Mobile] Build paper-taking screen layout
React Native screen showing: question body (scrollable), four answer option buttons, Previous/Next navigation, question counter ("Q 5 of 20"), a palette icon, and the countdown timer in the top bar. Single question visible at a time.

**E10-T04** [Mobile] Implement countdown timer hook with background persistence
Custom `useCountdownTimer(durationSeconds)` hook using `Date.now()` snapshots per tick to avoid drift. Listens to `AppState`: on background records `backgroundedAt`; on foreground subtracts elapsed time from remaining. Fires an `onExpire` callback when time reaches zero.

**E10-T05** [Mobile] Implement answer selection state with auto-save
Local `Map<questionId, optionIndex>` state. On answer tap, update state and debounce a POST to the auto-save endpoint (500ms). Tapping the currently selected option deselects it (sets null). Visual highlight uses a distinct selected colour.

**E10-T06** [Mobile] Build question palette bottom sheet
Slide-up bottom sheet showing a numbered grid of all questions. Grey = unattempted, green = answered, amber = flagged (flag toggle is a long-press on a question). Tapping any number navigates to that question and dismisses the sheet.

**E10-T07** [Mobile] Implement timer expiry auto-submit
The `onExpire` callback from the timer hook calls `POST /papers/:id/submit` with `{ autoSubmitted: true }`. Shows a toast "Time's up! Paper submitted automatically." Navigates to the results screen on API response.

---

## Epic 11 — Paper Submission & Results Screen

**E11-T01** [BE] Build `POST /papers/:id/submit` endpoint
Accepts the student's final answer array. Calculates score by comparing answers to `correct_option_index` on each question. Persists `score`, `submitted_at`, `time_taken_seconds`, and `auto_submitted`. Enqueues a `difficulty-recalc` BullMQ job. Returns the score summary.

**E11-T02** [BE] Build `GET /papers/:id/results` endpoint
Returns the full results payload: paper metadata (score, total, time, submitted_at) and per question: body, all four option texts, `selectedOptionIndex`, `correctOptionIndex`, and `explanation`. Auth and ownership enforced.

**E11-T03** [Mobile] Build submission confirmation dialog
When the student taps "Submit", show an Alert or custom modal: "You have answered X of Y questions. X unattempted." Two buttons: "Review" (dismiss) and "Submit" (call the submit endpoint). Show a loading spinner on Submit while the API call is in flight.

**E11-T04** [Mobile] Build results screen — score summary section
Top half of the results screen: circular score graphic, "X / Y correct", percentage, time taken formatted as mm:ss, and a colour-coded result badge (green ≥ 70%, amber 40–69%, red < 40%). "Retest This Topic" button at the bottom.

**E11-T05** [Mobile] Build results screen — question-by-question review
Scrollable list beneath the summary. Each item shows: question body, four options (student's selection highlighted blue, correct answer highlighted green, wrong selected highlighted red), and a collapsible explanation section below the options.

**E11-T06** [Mobile] Wire "Retest This Topic" CTA
The retest button on the results screen calls `POST /papers/generate` for the same topic, shows the loading screen, and navigates to the new paper on completion. Reuses the same loading and error flow built in Epic 08.

---

## Epic 12 — Credit Ledger & Deduction System

**E12-T01** [DB] Create `credit_balances` and `credit_transactions` tables
`credit_balances`: student_id (FK, unique), balance (int, default 0, check ≥ 0). `credit_transactions`: id (UUID), student_id (FK), type (enum), credits_delta (int), balance_after (int), reference_id (nullable), created_at.

**E12-T02** [BE] Build credit balance and transaction history endpoints
`GET /credits/balance` returns `{ balance }` for the authenticated student. `GET /credits/transactions` returns paginated transaction history in reverse chronological order. Both are auth-protected and scoped to the requesting student.

**E12-T03** [Mobile] Build credit balance header widget
Small component displaying a coin icon and the current credit count. Placed in the app's main navigation header. Fetches balance on mount and on app foreground (`AppState` listener). Tapping the widget navigates to the purchase screen.

**E12-T04** [Mobile] Build credit transaction history screen
Accessible from the profile screen. Paginated list of all credit transactions. Each row: date, type badge (Purchase/Paper/Refund colour-coded), credit delta (+X or -X), and balance after. Pull-to-refresh re-fetches.

**E12-T05** [Mobile] Implement low-credit push notification trigger
After every successful paper deduction, if the new balance ≤ 5 and no notification has been sent for this drop event in the last 24 hours, schedule a local push notification using `expo-notifications`: "Running low on credits! Top up to keep practising."

---

## Epic 13 — Razorpay Payment Integration

**E13-T01** [DB] Create `payment_records` and `credit_packs` tables
`payment_records`: id (UUID), student_id (FK), razorpay_payment_id (varchar, unique), razorpay_order_id, credit_pack_id (FK), amount_paise (int), status (enum), processed_at, created_at. `credit_packs`: id, name, credits (int), price_paise (int), is_active (bool). Seed three default packs.

**E13-T02** [BE] Build `POST /payments/create-order` endpoint
Auth required. Fetches the requested pack from `credit_packs`. Creates a Razorpay order server-side via the Razorpay API with amount, currency INR, and a receipt ID. Creates a `payment_records` row with status "pending". Returns `{ orderId, amount, keyId }`.

**E13-T03** [BE] Build Razorpay webhook handler `POST /webhooks/razorpay`
Verifies the HMAC-SHA256 signature using the `X-Razorpay-Signature` header against the webhook secret. On `payment.captured`: checks idempotency by querying for the payment ID in `payment_records`, credits the student, and marks the record "success". Returns 200.

**E13-T04** [BE] Implement webhook idempotency and signature validation
Before any side effects, query `payment_records` by `razorpay_payment_id`. If found with status "success", return 200 immediately — no crediting, no logging. Signature check uses `crypto.createHmac('sha256', secret)` and `timingSafeEqual` for comparison.

**E13-T05** [Mobile] Integrate Razorpay React Native SDK
Install `react-native-razorpay`. On receiving order details from the backend, call `RazorpayCheckout.open(options)`. Handle the `success` callback (navigate to success screen, refresh balance). Handle `error` and `cancel` callbacks (show failure message, return to purchase screen).

---

## Epic 14 — Credit Purchase UI & Transaction History

**E14-T01** [BE] Build `GET /credit-packs` public endpoint
Returns all active credit packs: id, name, credits, price in paise and formatted INR string. No auth required. Uses a short TTL Redis cache (60 seconds) so pack deactivations propagate quickly to the client.

**E14-T02** [Mobile] Build credit purchase screen
Fetches active packs from `GET /credit-packs`. Renders each as a tappable card showing pack name, credit count, and formatted price (e.g., "₹249"). Tapping a card calls `POST /payments/create-order` and opens the Razorpay sheet. Shows a loading state while the order is being created.

**E14-T03** [Mobile] Build post-payment success and failure states
On Razorpay success callback: show a brief success screen ("Credits added!") with the new balance, then navigate back to the topic screen. On failure or cancel: show a dismissible error banner on the purchase screen with a "Try Again" option.

**E14-T04** [Mobile] Build zero-credit purchase bottom sheet
A slide-up bottom sheet triggered when a student with 0 credits taps "Generate Paper". Shows the message "You're out of credits" with the top two active packs as quick-buy buttons and a "See all packs" link that opens the full purchase screen.

---

## Epic 15 — Analytics Data Pipeline

**E15-T01** [BE] Build `GET /analytics/summary` endpoint
Aggregates for the requesting student: count of all papers, mean score across all submitted papers, current streak (consecutive calendar days with ≥ 1 submission computed by walking backwards from today), and platform percentile (null if < 100 qualifying users).

**E15-T02** [BE] Implement platform percentile calculation query
Query the average score of all students with ≥ 3 submitted papers. Rank the requesting student's average among this group. Express rank as a 0–100 float. Return null if fewer than 100 students qualify. Cache the platform-wide sorted list for 1 hour in Redis.

**E15-T03** [BE] Build `GET /analytics/topics` endpoint
For each topic in the student's selected exam: return averageScore, attemptCount, lastScore, currentDifficulty band, and scoreHistory (last 10 papers ordered by submitted_at as `{ date, score }` array). Uses a single query with window functions.

**E15-T04** [BE] Build `GET /analytics/heatmap` endpoint
Returns a flat list of all topics for the student's exam with their topicId, topicName, subjectId, subjectName, and averageScore (null for unattempted topics). Sorted by subjectId then topic order_index. Designed for a single render of the heatmap grid.

---

## Epic 16 — Student Analytics Dashboard UI

**E16-T01** [Mobile] Build analytics screen navigation entry and summary cards
Add an Analytics tab to the bottom navigation bar. The screen top section shows four stat cards in a 2×2 grid: Total Papers, Average Score (%), Current Streak (days), Percentile rank. The Percentile card is hidden entirely when the backend returns null.

**E16-T02** [Mobile] Build score trend line chart component
Using `victory-native` or `react-native-gifted-charts`, render a line chart for a topic's `scoreHistory`. X-axis shows dates (abbreviated), Y-axis shows 0–100%. Tapping a data point shows a tooltip with the exact date and score.

**E16-T03** [Mobile] Build weakness heatmap grid
A grid layout of topic tiles (3 columns). Each tile shows the topic name (truncated to 2 lines) on a colour-coded background: red (#FCA5A5) for < 50%, amber (#FDE68A) for 50–74%, green (#86EFAC) for ≥ 75%, grey (#E5E7EB) for unattempted. Tapping navigates to that topic's generate screen.

**E16-T04** [Mobile] Build subject filter tab bar for analytics
Horizontally scrollable chip/tab row at the top of the heatmap and chart area. Chips: "All" + one per subject. Active chip highlighted. Selecting a chip updates the data source for both the heatmap and the trend chart to filter to that subject's topics only.

**E16-T05** [Mobile] Build analytics empty state and pull-to-refresh
For students with 0 papers: show a simple illustration and "Generate your first paper to start tracking" with a CTA button. Wrap the screen content in a ScrollView with a `refreshControl` that invalidates the React Query cache for all analytics endpoints.

---

## Epic 17 — Document Upload & Storage

**E17-T01** [DB] Create `documents` table migration
Define `documents` with id (UUID), admin_id (FK), exam_id (FK), subject_id (FK), topic_id (FK), filename, s3_key, file_size_bytes, status (enum: pending/processing/indexed/failed), error_message (nullable text), chunk_count (nullable int), created_at, updated_at.

**E17-T02** [Infra] Configure S3-compatible storage bucket
Create an S3 bucket (or MinIO for dev) for document storage. Set bucket to private (no public access). Create an IAM policy scoped to read/write on the documents prefix. Store credentials in environment secrets. Implement a presigned-URL utility for secure uploads.

**E17-T03** [BE] Build `POST /admin/documents/upload` endpoint
Accepts multipart form data: file (PDF/DOCX only, max 50MB) + examId, subjectId, topicId. Validates MIME type (not just extension). Uploads the file to S3 with a UUID-based key. Creates a `documents` DB record with status "pending". Enqueues a BullMQ ingestion job. Returns `{ documentId }`.

**E17-T04** [BE] Build document list and delete endpoints
`GET /admin/documents?topicId=X` returns all documents for a topic with id, filename, status, chunkCount, errorMessage, createdAt. `DELETE /admin/documents/:id` soft-deletes the DB record, deletes the S3 object, and enqueues a Pinecone cleanup job. Admin auth required.

**E17-T05** [BE] Build `GET /admin/documents/:id/status` polling endpoint
Returns `{ status, chunkCount, errorMessage }` for a single document. Used by the admin UI to poll for "pending" and "processing" documents every 5 seconds. Returns 404 if the document ID does not belong to the requesting admin's scope.

---

## Epic 18 — Document Ingestion Pipeline

**E18-T01** [BE] Build PDF and DOCX text extraction utilities
PDF extractor uses `pdf-parse` to extract raw text from a buffer; handles encrypted and image-only PDFs by throwing a typed `ExtractionError` with a descriptive message. DOCX extractor uses `mammoth` to strip formatting and return clean plain text.

**E18-T02** [BE] Build text chunking service
Wraps LangChain's `RecursiveCharacterTextSplitter` with chunk_size=512, chunk_overlap=50, and separator priority: `["\n\n", "\n", ". ", " "]`. Accepts raw text and returns `Array<{ text: string, chunkIndex: number }>`.

**E18-T03** [BE] Build chunk embedding service
Batches chunk texts into groups of 100 and calls `openai.embeddings.create({ model: "text-embedding-3-small", input: batch })`. Assembles and returns `Array<{ chunkIndex, embedding: number[] }>`. Handles rate limits with retry and exponential backoff.

**E18-T04** [BE] Build Pinecone upsert service
Accepts the embedding array and document metadata (documentId, exam, subject, topic). Formats vectors as `{ id: "${documentId}_${chunkIndex}", values: embedding, metadata }`. Batch-upserts to Pinecone in groups of 100. Returns the total count of upserted vectors.

**E18-T05** [BE] Build document ingestion BullMQ worker
Orchestrates the full pipeline: download from S3 → extract text → chunk → embed → upsert to Pinecone → update DB status to "indexed" with chunk_count. On step failure: retry up to 3 times with exponential backoff. After 3 failures: delete any partial Pinecone vectors by document_id filter, mark document "failed" with error message.

---

## Epic 19 — RAG Retrieval Integration

**E19-T01** [BE] Build RAG retrieval service
Accepts a `topicId` and a query string. Embeds the query with `text-embedding-3-small`. Queries Pinecone with a `topic` metadata filter and `topK: 5`. Formats the returned chunk texts into a single context string separated by `\n\n---\n\n`. Returns an empty string if no vectors exist for the topic.

**E19-T02** [BE] Wire RAG retrieval into the prompt construction service
In the prompt construction service (Epic 07), call the RAG retrieval service with the topic name as the query string. Pass the returned context string as `rag_context` when interpolating the prompt template. Log the retrieved chunk IDs at DEBUG level alongside the paper ID.

**E19-T03** [BE] Validate RAG integration end-to-end with a smoke test
Upload a 10-page NCERT chapter for a specific topic, wait for indexing, generate a paper for that topic, and assert in the generation log that the `rag_context` field is non-empty and references content from the uploaded document. Document the result as a test fixture.

---

## Epic 20 — Configurable Prompt Templates

**E20-T01** [DB] Create `prompt_templates` table and seed defaults
`prompt_templates`: id (UUID), subject_id (FK), template_body (text), version (int), is_active (bool), created_by (FK → admin_users), created_at. Partial unique index on subject_id where is_active = true. Seed one default template per subject with all required variables present.

**E20-T02** [BE] Build `GET /admin/prompts` and `GET /admin/prompts/:subjectId` endpoints
The list endpoint returns all subjects with current active template metadata (version, last updated, first 200-char preview). The detail endpoint returns the full template body and a version history array. Admin+ auth required for both.

**E20-T03** [BE] Build template variable validator and `PUT /admin/prompts/:subjectId` endpoint
Validator checks presence of all four required variables using regex. PUT endpoint validates, deactivates the current template, inserts a new version, logs to audit log, and returns the new record. Returns 422 with missing variable names on validation failure. Super admin only.

**E20-T04** [BE] Build `POST /admin/prompts/:subjectId/preview` endpoint and update prompt retrieval service
Preview interpolates the submitted draft template with sample values and returns the rendered string. Update the prompt retrieval service to always query the DB for the latest active template (no caching) so admin changes are immediately effective.

**E20-T05** [Web] Build prompt configuration screen in admin dashboard
List screen showing all subjects with current version, last updated date, and an Edit button (hidden for `admin` role, shown for `super_admin`). Clicking Edit opens the full-screen editor modal built in the next task.

**E20-T06** [Web] Build prompt template editor modal
Full-screen modal with a `<textarea>` using monospace font. Client-side `{{variable}}` highlighting via regex-replaced span overlays. Variable reference guide in a right-side panel. "Preview" button calls the preview endpoint and shows the result in a read-only sub-modal. "Save" calls PUT and shows a success toast or inline errors.

---

## Epic 21 — Admin Auth & Dashboard Shell

**E21-T01** [DB] Create `admin_users` table migration
Define `admin_users` with id (UUID), email (unique), password_hash (bcrypt), role (enum: admin/super_admin), is_active (bool, default true), created_at. Seed one super_admin from environment variables via a first-run seed script.

**E21-T02** [BE] Build admin login endpoint and session management
`POST /admin/auth/login` accepts email + password, bcrypt-compares the hash, issues an admin JWT (8-hour expiry) set as an HTTP-only SameSite=Strict cookie. Returns `{ role }`. `POST /admin/auth/logout` clears the cookie.

**E21-T03** [BE] Build admin JWT middleware and RBAC guard
Middleware reads the admin cookie, verifies the JWT, attaches `req.admin = { id, role }`. A `requireRole('super_admin')` guard function wraps routes that need elevated permissions, returning 403 for insufficient roles.

**E21-T04** [Web] Scaffold Next.js admin app with auth layout and navigation guard
Next.js project with a `/login` page, an authenticated layout wrapping all other pages (sidebar + top bar), and a `getServerSideProps`-based auth check that redirects unauthenticated requests to `/login`.

**E21-T05** [Web] Build admin login page and shared layout shell
Login page with email/password form, loading state, and error display. Shared layout includes a sidebar with nav links (filtered by role), a top bar showing the admin's email and role badge, and a logout button that calls the logout endpoint and redirects to login.

---

## Epic 22 — Student User Management

**E22-T01** [BE] Build `GET /admin/users` search and paginate endpoint
Accepts `q` (search by phone or email using ILIKE), `page`, `limit` (default 25). Returns paginated student records: id, name, phone, email, targetExam, creditBalance, isActive, createdAt. Admin+ auth required.

**E22-T02** [BE] Build `GET /admin/users/:userId` detail endpoint
Returns full student profile: onboarding data, last 10 papers (topicName, score, submittedAt), last 10 credit transactions, current balance, and isActive flag. Joins across multiple tables in a single query. Admin+ auth.

**E22-T03** [BE] Build `PATCH /admin/users/:userId/status` endpoint
Accepts `{ isActive: bool }`. Updates `users.is_active`. If disabling, revokes all active `refresh_tokens` for that user (sets `revoked = true`). Logs to admin audit log. Returns updated user status.

**E22-T04** [Web] Build user management list screen
Search input (min 3 chars before firing) + paginated table (25/page): name, phone, exam badge, credit balance, Active/Disabled status badge. "View" button per row navigates to the detail page. Displays a "No results" empty state.

**E22-T05** [Web] Build student detail page with disable/enable toggle
Detail page showing onboarding data, papers table (last 10), transactions table (last 10), and current balance. Active/Disabled toggle at the top right triggers a confirmation dialog: "Disable this account?" with Confirm/Cancel. On confirm, calls PATCH status endpoint.

---

## Epic 23 — Platform Analytics Dashboard

**E23-T01** [BE] Build `GET /admin/analytics/overview` endpoint
Returns: `dau` (distinct student_ids with a paper submitted today), `papersToday`, `totalRevenue` (sum of successful payment amounts in paise), `dauSeries7d` (array of `{ date, count }` for last 7 days), `dauSeries30d`, `packSales` (group-by pack type count for 30 days). Super admin auth.

**E23-T02** [Web] Build platform analytics dashboard screen
Headline metric cards (DAU, Papers Today, Total Revenue). Two line charts (7-day / 30-day DAU) with a toggle. Bar chart for pack sales. Auto-refreshes every 5 minutes via `setInterval`. Manual "Refresh" button invalidates the fetch and re-queries.

---

## Epic 24 — Credit Pack Management

**E24-T01** [BE] Build credit pack CRUD admin endpoints
`POST /admin/credit-packs` creates a pack. `PUT /admin/credit-packs/:id` updates name/credits/price. `DELETE /admin/credit-packs/:id` soft-deactivates (sets is_active = false) after checking at least one other active pack exists. All require super_admin. All mutations log to the audit log.

**E24-T02** [Web] Build credit pack management screen
Table listing all packs with columns: name, credits, price, status (Active/Inactive), and action buttons (Edit, Deactivate). "Create Pack" button opens a modal form. Edit button populates the form with existing data. Deactivate shows a confirmation dialog. All actions call the CRUD endpoints and refresh the table.

---

## Epic 25 — Content & Prompt Admin UI

**E25-T01** [Web] Build document upload form and document list in admin dashboard
Content Management page with a cascading Exam → Subject → Topic dropdown set and a file picker (PDF/DOCX, 50MB limit enforced client-side). On upload success, the document appears in the list below with a "Processing" badge that polls the status endpoint every 5 seconds until it reaches "Indexed" or "Failed".

**E25-T02** [Web] Build document delete confirmation flow
Each document row in the list has a Delete button. Clicking it shows a confirmation modal: "Delete [filename]? This will remove it from the AI knowledge base." On confirm, calls `DELETE /admin/documents/:id` and removes the row from the list with a brief success toast.

---

## Epic 26 — Audit Log

**E26-T01** [DB] Create `admin_audit_log` table migration
Define `admin_audit_log` with id (UUID), admin_id (FK → admin_users), action_type (varchar), resource_type (varchar), resource_id (varchar), metadata (jsonb, nullable for before/after snapshots), created_at. No update or delete on this table — append-only enforced at the DB level via a trigger or application-level constraint.

**E26-T02** [BE] Build audit logging utility and wire it to all sensitive endpoints
`logAdminAction(adminId, actionType, resourceType, resourceId, metadata?)` inserts asynchronously without blocking the main request. Wire this call into: user disable/enable, prompt template update, pack create/edit/deactivate, document delete, and admin login.

**E26-T03** [BE] Build `GET /admin/audit-log` endpoint
Returns paginated audit log (50 per page, reverse chronological). Accepts optional query filters: `adminId`, `actionType`, `dateFrom`, `dateTo`. Joins with `admin_users` to return the acting admin's email. Accessible to both `admin` and `super_admin` roles.

**E26-T04** [Web] Build audit log screen in admin dashboard
Paginated table with columns: timestamp, admin email, action type badge (colour-coded), resource type, resource ID. Filter controls: date range picker, admin selector dropdown, action type multi-select. "Clear Filters" button. No edit or delete affordances anywhere on the screen.

---

_End of TASK.md_

---

| Field        | Value          |
| ------------ | -------------- |
| Document     | Task Breakdown |
| Product      | Examdex        |
| Version      | 2.0 — 26 Epics |
| Total Tasks  | ~105           |
| Last Updated | February 2026  |
