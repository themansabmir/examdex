# Examdex — 1-Hour Task Breakdown (All 26 Epics)

---

## Epic 01 — Phone OTP Authentication

---

**Task 01.1 — POST /auth/request-otp**

- Accept `{ phone }` in request body; validate regex `^\+91[6-9]\d{9}$`, return 400 if invalid
- Lookup `User` by `phoneNumber`; if not found, create new `User` record with `userType = student`, `isOnboarded = false`
- Delete any existing `OtpStorage` record for `(userId, channel = "sms")` to invalidate previous OTP
- Generate 6-digit random OTP string; bcrypt-hash it; set `expiresAt = now() + 5 minutes`
- Insert new `OtpStorage` row with `(userId, channel, codeHash, expiresAt, attempts = 0, verified = false)`
- Call SMS provider SDK with plain OTP to student phone number
- Return `200 { message: "OTP sent" }` — never return the OTP in the response

---

**Task 01.2 — POST /auth/verify-otp**

- Accept `{ phone, otp }` in request body
- Lookup `User` by `phoneNumber`; 404 if not found
- Lookup `OtpStorage` by `(userId, channel = "sms")`; 401 if not found
- If `expiresAt < now()`, return 401 `{ error: "OTP expired" }`
- If `attempts >= 5`, return 429 `{ error: "Too many attempts, request a new OTP" }`
- `bcrypt.compare(otp, codeHash)`; if mismatch, increment `attempts`, return 401 `{ error: "Invalid OTP", remainingAttempts: 5 - attempts }`
- On match: mark `OtpStorage.verified = true`; update `User.lastLoginAt = now()`
- Sign JWT access token (`userId`, `userType`, exp 15 min); sign refresh token (exp 30 days)
- Store refresh token hash in Redis with key `refresh:{userId}` and TTL 30 days
- Return `200 { accessToken, refreshToken, user: { id, isOnboarded } }`

---

**Task 01.3 — POST /auth/refresh-token**

- Accept `{ refreshToken }` in request body
- Decode JWT to extract `userId`; return 401 if tampered or expired
- Lookup stored hash in Redis at `refresh:{userId}`; compare with incoming token hash; return 401 if mismatch (revoked)
- Sign new access token (15 min); sign new refresh token (30 days)
- Overwrite Redis key `refresh:{userId}` with new refresh token hash and reset TTL to 30 days (rotation)
- Return `200 { accessToken, refreshToken }`

---

**Task 01.4 — POST /auth/logout**

- Require valid access token (JWT middleware)
- Delete Redis key `refresh:{userId}` to revoke refresh token server-side
- Return `200 { message: "Logged out" }`

---

**Task 01.5 — JWT Auth Middleware**

- Extract Bearer token from `Authorization` header; return 401 if missing
- Verify JWT signature and expiry; return 401 if invalid or expired
- Lookup `User` by `userId` from token payload; return 401 if not found
- Check `User.isActive === true`; return 403 `{ error: "Account suspended" }` if false
- Attach `req.user = { id, userType, isOnboarded }` and call `next()`

---

## Epic 02 — Google OAuth & Session Management

---

**Task 02.1 — POST /auth/google**

- Accept `{ idToken }` (Google ID token from React Native Google Sign-In SDK) in body
- Call `google-auth-library` `verifyIdToken()` with the received token; return 401 if verification fails
- Extract `email`, `name`, `googleSub` from verified payload
- Lookup `User` by `email`; if found, link Google account (no new user created); if not found, create new `User` with `email`, `fullName`, `userType = student`
- Update `User.lastLoginAt = now()`
- Sign access token (15 min) + refresh token (30 days); store refresh hash in Redis
- Return `200 { accessToken, refreshToken, user: { id, isOnboarded } }`

---

**Task 02.2 — Token Refresh Interceptor (Mobile — React Native)**

- Install Axios interceptor on the shared API client instance
- On every request, check if stored access token expires within 60 seconds; if so, call `POST /auth/refresh-token` before proceeding
- On 401 response from any endpoint, attempt one silent refresh; if refresh succeeds, retry original request; if refresh fails (401), clear tokens from secure storage and navigate user to Login screen with message "Session expired, please log in again"
- Store `accessToken` and `refreshToken` using `expo-secure-store` (never AsyncStorage)

---

**Task 02.3 — POST /auth/logout (shared, covers Epic 01 + 02)**

- _(Already covered in Task 01.4 — no duplication needed)_
- Verify this endpoint correctly handles both OTP-auth and Google-auth users by checking Redis key deletion only (no OTP-specific logic)
- Add integration test: call logout → attempt refresh → confirm 401 returned

---

## Epic 03 — Student Onboarding Wizard

---

**Task 03.1 — GET /onboarding/status**

- Require auth middleware
- Return `User.isOnboarded` and current `UserExamPreference` records for the user
- If partial onboarding data exists in `UserExamPreference`, include `{ step, examId, targetYear }` so the client knows which step to resume from
- Return `200 { isOnboarded: bool, resumeStep: 1|2|3, partialData: { examId?, targetYear? } }`

---

**Task 03.2 — POST /onboarding/step-1 (Exam Selection)**

- Require auth middleware; reject if `User.isOnboarded = true`
- Accept `{ examId }` in body; validate `examId` exists in `Exam` table and `isActive = true`; return 404 if not found
- Upsert `UserExamPreference` with `(userId, examId, isPrimary = true)`; set `targetExamDate = null` (not yet set)
- Return `200 { message: "Step 1 saved", examId }`

---

**Task 03.3 — POST /onboarding/step-2 (Target Year)**

- Require auth middleware; reject if `User.isOnboarded = true`
- Accept `{ examId, targetYear }` in body; validate `targetYear` is current year, +1, or +2 only
- Update `UserExamPreference.targetExamDate` for the given `examId` to `YYYY-12-31` of the chosen year
- Return `200 { message: "Step 2 saved", targetYear }`

---

**Task 03.4 — POST /onboarding/complete (Step 3 — Subject Ratings + Seed Difficulty)**

- Require auth middleware; reject if `User.isOnboarded = true`
- Accept `{ examId, subjectRatings: [{ subjectId, rating: 1-5 }] }` in body
- Validate all `subjectId` values belong to the given `examId` via `ExamSubject` table
- For the adaptive engine: store baseline ratings in `SystemConfig` as a JSON blob keyed `onboarding:baseline:{userId}` (no new table needed — the adaptive engine will read from `PaperAttempt` history; baseline is informational)
- Set `User.isOnboarded = true` in the same DB transaction
- Return `200 { message: "Onboarding complete" }`

---

**Task 03.5 — Onboarding Wizard UI — 3-Step Screen Flow (Mobile)**

- On app launch after login, call `GET /onboarding/status`; if `isOnboarded = false`, redirect to OnboardingNavigator and lock HomeScreen behind a guard
- Step 1 Screen: fetch `GET /exams` to get active exams; render tappable cards for CUET / JEE / NEET; disable "Next" button until a card is selected; on Next, call `POST /onboarding/step-1`
- Step 2 Screen: render year picker chips for current year and next 2 years; disable "Next" until selected; on Next, call `POST /onboarding/step-2`
- Step 3 Screen: fetch subjects for selected exam; render a 1–5 star/slider rating per subject; on Submit, call `POST /onboarding/complete`
- Show a `ProgressIndicator` component (e.g., 3 dots or step bar) visible across all steps
- On success of Step 3, navigate to HomeScreen and never show OnboardingNavigator again (check `isOnboarded` on every app resume)

---

## Epic 04 — Syllabus Data Model & Seeding

---

**Task 04.1 — Seed Script: Exams, Subjects, ExamSubjects**

- Create `prisma/seed.ts`; use `prisma.exam.upsert` for JEE, NEET, CUET with correct `examCode`, `examName`, `examBoard`
- Upsert base `Subject` records (Physics, Chemistry, Mathematics, Biology, etc.) with `subjectCode`
- Upsert `ExamSubject` linking records with correct `displayOrder` per exam
- Run `npx prisma db seed` and verify counts: 3 exams, N subjects, correct ExamSubject join rows

---

**Task 04.2 — Seed Script: Chapters for All Subjects**

- Extend `prisma/seed.ts` to upsert `Chapter` records for each `Subject` using NTA syllabus data (hardcoded JSON array in seed file)
- Each chapter has: `subjectId`, `chapterCode`, `chapterName`, `classId` (optional, link to Class 11/12 if applicable)
- Upsert `Class` records for Class 11 and Class 12 first
- Verify chapter count per subject matches NTA syllabus chapter count

---

**Task 04.3 — GET /admin/syllabus/:examId (Syllabus Tree Endpoint)**

- Require admin auth middleware
- Accept `examId` as path param and optional `?page=1&limit=50` query params
- Query: `ExamSubject` → `Subject` → `Chapter` for the given exam, ordered by `displayOrder` then `chapterCode`
- Return paginated response: `{ exam, subjects: [{ subject, chapters: [{ chapter }] }], pagination }`
- Set `Cache-Control: public, max-age=86400` header on response

---

**Task 04.4 — Admin Syllabus CRUD API (Chapter soft-delete + rename)**

- `POST /admin/chapters` — create a new chapter: accept `{ subjectId, chapterCode, chapterName, classId? }`; validate `subjectId` exists; insert into `Chapter`
- `PATCH /admin/chapters/:id` — rename chapter: accept `{ chapterName }`; update record; return updated chapter
- `DELETE /admin/chapters/:id` — soft-delete: set `Chapter.isActive = false`; do not hard-delete
- All three endpoints require admin auth middleware; return appropriate 404 if resource not found

---

## Epic 05 — Subject & Topic Browse Experience

---

**Task 05.1 — GET /subjects (Subjects List for Student's Active Exam)**

- Require student auth middleware
- Derive student's active exam from `UserExamPreference` where `isPrimary = true`
- Query `ExamSubject` for that exam, join `Subject`; filter `isActive = true`; order by `displayOrder`
- For each subject, compute `averageScore`: aggregate `PaperAttempt.percentage` where `userId = req.user.id` and paper's `examSubjectId` matches; return `null` if no attempts
- Return `200 { examId, subjects: [{ id, subjectName, averageScore }] }`

---

**Task 05.2 — GET /subjects/:subjectId/chapters (Chapter + Topic List with Student Scores)**

- Require student auth middleware
- Query `Chapter` by `subjectId` where `isActive = true`; order by `chapterCode`
- For each chapter, fetch the student's last `PaperAttempt` for papers linked to that chapter: `lastScore`, `lastAttemptedAt` (null if never attempted)
- Sort chapters: those with a score < 50% first, then never-attempted (`lastScore = null`), then score ≥ 50%
- Return `200 { chapters: [{ id, chapterName, lastScore, lastAttemptedAt }] }`

---

**Task 05.3 — GET /subjects with ?examId query param (Exam Switcher)**

- Extend `GET /subjects` endpoint to accept an optional `?examId=` query param
- If `examId` is provided and belongs to a valid active exam, use it instead of the student's primary exam preference
- Update `UserExamPreference.isPrimary` if the student explicitly switches: `PATCH /profile/exam` endpoint accepts `{ examId }` and sets the new primary
- Return the same subjects payload as Task 05.1

---

**Task 05.4 — Subject List Screen with 24h Cache (Mobile)**

- On HomeScreen mount, check local cache (AsyncStorage key `syllabus:{examId}:ts`); if timestamp < 24h, load from `syllabus:{examId}:data` without network call
- If cache is stale or missing, call `GET /subjects` and store response + current timestamp in AsyncStorage
- Render a `SubjectCard` per subject showing `subjectName` and `averageScore` badge (grey if null, coloured if set)
- Tapping a card navigates to `ChapterListScreen` with `subjectId`

---

**Task 05.5 — Chapter List Screen with Search (Mobile)**

- On mount, call `GET /subjects/:subjectId/chapters` (network, not cached — scores change frequently)
- Render a `FlatList` of `ChapterRow` showing: chapter name, last score ("New" if null), last attempted date (dash if null)
- Add a `TextInput` search bar above the list; debounce input by 300ms using `setTimeout`/`clearTimeout`; filter rendered list client-side by `chapterName.toLowerCase().includes(query)`
- Show empty state with copy "No chapters found" if search returns zero results

---

## Epic 06 — Core Paper Generation API

---

**Task 06.1 — POST /papers/generate**

- Require student auth middleware
- Accept `{ examSubjectId, chapterId?, difficultyOverride? }` in body; validate `examSubjectId` exists in `ExamSubject`
- Open a Prisma database transaction:
  - Re-fetch `User.creditBalance` with a row-level lock (`SELECT ... FOR UPDATE`)
  - If `creditBalance < 1`, rollback and return 402 `{ error: "Insufficient credits" }`
  - Decrement `User.creditBalance -= 1`
  - Insert `CreditTransaction` with `transactionType = "paper_generation"`, `creditsChange = -1`, `balanceAfter = newBalance`, `relatedPaperId` (set after paper creation)
  - Insert `GeneratedPaper` with `generationStatus = "pending"`, `userId`, `examId`, `examSubjectId`, `questionsData = []`, `selectedTopics = []`, `difficultyDistribution = {}`, `totalQuestions = 0`, `maxMarks = 0`, `timeLimitMinutes = 30`
  - Commit transaction
- Enqueue BullMQ job `generate-paper` with `{ paperId, examSubjectId, chapterId, userId }`
- Return `202 { jobId, paperId }`

---

**Task 06.2 — GET /papers/job/:jobId (Polling Endpoint)**

- Require student auth middleware
- Lookup BullMQ job by `jobId` from the queue
- Verify the job's data `userId` matches `req.user.id`; return 403 if mismatch
- If job state is `waiting` or `active`, return `200 { status: "pending" }`
- If job state is `completed`, fetch `GeneratedPaper` by `paperId` from job data; return `200 { status: "done", paper: { paperId, questionsData (without correctAnswer), timeLimitMinutes } }`
- If job state is `failed`, return `200 { status: "failed" }`

---

**Task 06.3 — Credit Refund on Terminal Generation Failure**

- In the BullMQ worker's `failed` event handler (after all retries exhausted):
  - Fetch `paperId` from job data
  - Update `GeneratedPaper.generationStatus = "failed"`
  - Open a Prisma transaction: increment `User.creditBalance += 1`; insert `CreditTransaction` with `transactionType = "refund"`, `creditsChange = +1`, `balanceAfter`, `relatedPaperId = paperId`
  - Commit transaction
- Log the failure reason and `paperId` to the application logger

---

**Task 06.4 — GET /papers (Paper History)**

- Require student auth middleware
- Accept `?page=1&limit=20` query params
- Query `GeneratedPaper` where `userId = req.user.id` and `generationStatus = "success"`, ordered by `createdAt DESC`
- Join `PaperAttempt` to get the latest attempt's `percentage` and `submittedAt` per paper
- Return `200 { papers: [{ paperId, paperTitle, examSubjectId, createdAt, lastScore, lastAttemptedAt }], pagination }`

---

**Task 06.5 — GET /papers/:id (Single Paper Detail without Answers)**

- Require student auth middleware
- Fetch `GeneratedPaper` by `id`; verify `userId = req.user.id`; return 403 if not owner
- Strip `correctAnswer` and `solution` fields from each item in `questionsData` JSON before returning
- Return `200 { paper: { paperId, paperTitle, questionsData (sanitised), timeLimitMinutes, totalQuestions, maxMarks } }`

---

## Epic 07 — LLM Integration & Prompt Engine

---

**Task 07.1 — Prompt Builder Service**

- Create `src/services/promptBuilder.ts`
- Accept `{ examSubjectId, chapterId, difficulty, ragContext, numQuestions }` as input
- Query `AiPromptTemplate` where `examSubjectId = input.examSubjectId` and `isActive = true`; throw if not found
- Replace `{{topic}}` with chapter name, `{{difficulty}}` with band label, `{{rag_context}}` with `ragContext` string, `{{num_questions}}` with `numQuestions`
- Log the fully rendered prompt at `DEBUG` level with `paperId` context
- Return the rendered prompt string

---

**Task 07.2 — OpenAI Client with Retry Logic**

- Create `src/services/openaiClient.ts`
- Initialise `OpenAI` client with `apiKey` from env; set request timeout to 8 seconds
- Export `generateQuestions(prompt: string): Promise<RawLLMResponse>` function
- Call `openai.chat.completions.create` with `model: "gpt-4o"`, `response_format: { type: "json_object" }`, and the prompt as user message
- Wrap call in a retry loop: on `APIError` with 5xx status or timeout error, wait `2^attempt * 500ms` and retry; max 2 retries (3 total attempts)
- Throw `LLMGenerationError` after all retries exhausted

---

**Task 07.3 — JSON Schema Validator for LLM Response**

- Create `src/services/questionValidator.ts`
- Accept parsed JSON from OpenAI response
- Validate it is an array; each item must have:
  - `body`: string, length ≥ 10
  - `options`: array of exactly 4 strings
  - `correctIndex`: integer 0–3
  - `explanation`: string, length ≥ 20
- Return `{ valid: true, questions }` or `{ valid: false, errors: string[] }`
- Export this as a pure function with no side effects (easy to unit test)

---

**Task 07.4 — BullMQ Paper Generation Worker**

- Create `src/workers/paperGenerationWorker.ts`; register `generate-paper` queue processor
- Step 1: call `promptBuilder` to build prompt (includes RAG context from Epic 19 service — pass empty string if not yet integrated)
- Step 2: call `openaiClient.generateQuestions(prompt)`; on failure after retries, throw to trigger BullMQ retry (max 2 job retries)
- Step 3: parse JSON response; call `questionValidator`; if invalid, retry generation up to 2 times (inner loop); if still invalid after 2, throw
- Step 4: on valid questions, open Prisma transaction: update `GeneratedPaper.questionsData`, `generationStatus = "success"`, `totalQuestions`, `generationLatencyMs`, `aiPromptTemplateId`
- Worker automatically triggers credit refund via `failed` event handler wired in Task 06.3

---

## Epic 08 — Paper Generation Mobile UX

---

**Task 08.1 — Generate Paper Button + Loading Screen (Mobile)**

- On `TopicDetailScreen`, show a "Generate Paper" button
- On tap: check `user.creditBalance` from global state; if `< 1`, show `BuyCreditsBottomSheet` and return without calling API
- If credits available, call `POST /papers/generate`; on 202, navigate to `PaperLoadingScreen` passing `{ jobId, paperId }`
- `PaperLoadingScreen`: show a `LottieView` animation; start a polling interval (`setInterval`) every 1500ms calling `GET /papers/job/:jobId`
- On `status = "done"`: clear interval; navigate to `PaperTakingScreen` with paper data
- On `status = "failed"`: clear interval; dismiss loading; show toast "Paper generation failed. Your credit has been refunded." with a "Try Again" button that navigates back to `TopicDetailScreen`
- On back press from `PaperLoadingScreen`, cancel the interval and navigate to `TopicDetailScreen` (not the paper screen)

---

**Task 08.2 — Paper History Screen (Mobile)**

- Create `PaperHistoryScreen` accessible from the profile tab or bottom nav
- On mount, call `GET /papers?page=1&limit=20`
- Render a `FlatList`; each row shows: topic/chapter name, score badge (coloured by percentage), date string
- Implement pagination: on `onEndReached`, fetch next page and append to list
- Empty state: "No papers yet — generate your first one!" with a CTA button navigating to subject browse
- Tapping a row navigates to `ResultsScreen` with `paperId`

---

## Epic 09 — Adaptive Difficulty Engine

---

**Task 09.1 — Difficulty Band Calculator Service**

- Create `src/services/difficultyEngine.ts`
- Export `getBand(score: number): string` — maps 1.0–1.9 → "Foundation", 2.0–2.9 → "NCERT Standard", 3.0–3.9 → "JEE Mains Level", 4.0–4.9 → "JEE Advanced Level", 5.0 → "Expert"
- Export `computeEMA(oldScore: number, normalisedScore: number, alpha: number): number` — applies formula, clamps result to 1.0–5.0
- Export `checkPromotion(recentAttempts: PaperAttempt[], currentBand: string): string` — if last 3 attempts all ≥ 80%, return next band; if last 2 attempts all ≤ 40%, return previous band; else return current band
- All functions are pure and unit-testable with no DB calls

---

**Task 09.2 — POST /internal/difficulty/recalculate (Async Worker Trigger)**

- Create a BullMQ queue `recalculate-difficulty`
- After `PaperAttempt` submission (Task 11.1), enqueue a job with `{ userId, examSubjectId, chapterId, percentage }`
- Worker: fetch `alpha` from `SystemConfig` where `configKey = "ema_alpha"` (default 0.3)
- Fetch current difficulty score from `SystemConfig` key `difficulty:{userId}:{chapterId}` (store as JSON `{ score, band }`)
- Compute new EMA score using `difficultyEngine.computeEMA`; determine new band
- Check promotion/demotion using last 3/2 `PaperAttempt` records for this user + chapter
- Write updated `{ score, band }` back to `SystemConfig` key `difficulty:{userId}:{chapterId}`
- Append an entry to `SystemConfig` key `difficulty_audit:{userId}:{chapterId}` as a JSON array (append new entry)
- Worker is async and does not block the submission response

---

**Task 09.3 — GET /chapters/:chapterId/difficulty (Current Band for UI)**

- Require student auth middleware
- Read `SystemConfig` key `difficulty:{userId}:{chapterId}`; return `{ score, band }` or default `{ score: 1.0, band: "Foundation" }` if not set
- Return `200 { chapterId, score, band }`
- Used by `TopicDetailScreen` to display current difficulty badge

---

## Epic 10 — Paper Taking Interface

---

**Task 10.1 — Paper Taking Screen — Question Renderer + Navigation (Mobile)**

- Create `PaperTakingScreen`; receive `{ paper }` from navigation params
- Store `currentIndex`, `answers` (map of `questionNumber → selectedOption | null`), `flagged` (Set of questionNumbers) in `useState`
- Render one question at a time: question body text, 4 option buttons with visual highlight on selection; tapping selected option again sets it to `null` (deselect)
- "Previous" and "Next" buttons; "Previous" disabled at index 0; "Next" disabled at last question
- Display question counter "Q {current} / {total}" at top

---

**Task 10.2 — Countdown Timer with Background Accuracy (Mobile)**

- Derive `endTime = Date.now() + timeLimitMinutes * 60 * 1000` on screen mount; store in `useRef`
- Every second, compute `remaining = endTime - Date.now()`; update display as `MM:SS`
- On `AppState` change to `active`, recompute remaining from `endTime` (wall-clock based, not decrement-based) — this ensures background accuracy
- When `remaining <= 0`: call auto-submit function (same logic as Task 11.1 but skips confirmation dialog); show toast "Time's up! Paper submitted."
- Clear interval on screen unmount to prevent memory leaks

---

**Task 10.3 — Answer Auto-Save to Backend (Mobile)**

- On every answer selection change, debounce 800ms then call `PATCH /papers/attempts/:attemptId/autosave`
- `PATCH /papers/attempts/:attemptId/autosave` endpoint: accept `{ answersData: [...] }`; update `PaperAttempt.answersData` in DB; return `200`
- Create the `PaperAttempt` record with `isCompleted = false` when the student first loads `PaperTakingScreen` (call `POST /papers/:paperId/start`)
- On app relaunch, if an incomplete `PaperAttempt` exists for a paper, restore answers from `PaperAttempt.answersData`

---

**Task 10.4 — Question Palette (Mobile)**

- Render a grid of question number chips below or in a modal sheet
- Each chip colour: grey = `answers[qNum] === null` and not flagged; green = answered; amber = flagged
- Tapping any chip sets `currentIndex` to that question's index
- Add a "Flag" button on each question view that toggles the question in the `flagged` Set and updates chip colour

---

## Epic 11 — Paper Submission & Results Screen

---

**Task 11.1 — POST /papers/:paperId/submit**

- Require student auth middleware; verify `GeneratedPaper.userId = req.user.id`
- Accept `{ attemptId, answersData: [{ questionNumber, studentAnswer }], timeTakenSeconds }` in body
- Fetch full `GeneratedPaper.questionsData` (with correct answers — server side only)
- Score calculation: for each question, compare `studentAnswer` to `correctAnswer`; increment `correctAnswers`, `incorrectAnswers`, `unattempted`; sum `marksAwarded` per question
- Compute `totalScore`, `percentage`
- Update `PaperAttempt`: set `answersData` (with `isCorrect` and `marksAwarded` filled in), `totalScore`, `percentage`, `correctAnswers`, `incorrectAnswers`, `unattempted`, `timeTakenSeconds`, `submittedAt = now()`, `isCompleted = true`
- Update `GeneratedPaper.attemptCount += 1`
- Enqueue `recalculate-difficulty` job (Task 09.2)
- Return `200 { attemptId, totalScore, percentage, correctAnswers, incorrectAnswers, unattempted, timeTakenSeconds }`

---

**Task 11.2 — GET /papers/:paperId/results/:attemptId**

- Require student auth middleware; verify ownership
- Fetch `PaperAttempt` by `attemptId`; fetch `GeneratedPaper` by `paperId`
- Merge `questionsData` (full, with `correctAnswer`, `explanation`) with `answersData` (student answers, `isCorrect`)
- Derive `scoreBadge`: `percentage >= 70` → "green", `>= 40` → "amber", else "red"
- Return `200 { score, percentage, timeTakenSeconds, scoreBadge, questions: [{ body, options, studentAnswer, correctIndex, isCorrect, explanation }] }`

---

**Task 11.3 — Results Screen UI (Mobile)**

- Create `ResultsScreen`; receive `{ paperId, attemptId }` from navigation params; call `GET /papers/:paperId/results/:attemptId` on mount
- Show summary card: score "X/Y", percentage, time taken, colour-coded badge
- Render a `ScrollView` of question review cards: each shows question body, 4 options — student's selected option highlighted red if wrong, correct option highlighted green regardless; explanation text below
- "Retest This Topic" button: calls `POST /papers/generate` with the same `examSubjectId` and `chapterId`; navigates to loading screen on 202
- Confirmation dialog on manual submit: "You have answered X of Y questions. Confirm?" with "Review" (dismiss dialog) and "Submit" (proceed) buttons

---

## Epic 12 — Credit Ledger & Deduction System

---

**Task 12.1 — GET /credits/balance**

- Require student auth middleware
- Read `User.creditBalance` from DB
- Return `200 { balance: number }`

---

**Task 12.2 — GET /credits/transactions**

- Require student auth middleware
- Accept `?page=1&limit=20` query params
- Query `CreditTransaction` where `userId = req.user.id`, ordered by `createdAt DESC`
- Return `200 { transactions: [{ id, transactionType, creditsChange, balanceAfter, createdAt, relatedPaperId }], pagination }`

---

**Task 12.3 — Low Balance Push Notification Trigger**

- After every `CreditTransaction` insert of type `paper_generation`, check `User.creditBalance`
- If `creditBalance <= 5`: check `SystemConfig` key `low_balance_notified:{userId}`; if it does not exist or was set when balance was > 5, send push notification "Your credit balance is low — buy more to keep practising" and write `SystemConfig` key `low_balance_notified:{userId} = true`
- If next deduction takes balance below 5 but flag already exists, skip notification (fire once per crossing event)
- Reset flag when balance is topped up above 5: after any `purchase` transaction where `balanceAfter > 5`, delete the `SystemConfig` key

---

**Task 12.4 — Credit Balance Widget (Mobile)**

- Create a `CreditBadge` component that reads from global auth/user state
- Display in the app header on every screen (add to root `AppNavigator` header)
- After any API call that may change credits (`generate`, `purchase`, `refund`), call `GET /credits/balance` and update global state
- Render: coin icon + balance number; tap navigates to `TransactionHistoryScreen`

---

## Epic 13 — Razorpay Payment Integration

---

**Task 13.1 — POST /payments/create-order**

- Require student auth middleware
- Accept `{ pricingTierId }` in body; validate `PricingTier` exists and `isActive = true`
- Call Razorpay Node SDK `orders.create({ amount: priceInr * 100, currency: "INR", receipt: uuid })` (amount in paise)
- Log: `{ userId, razorpayOrderId, amountPaise, pricingTierId, createdAt }`
- Return `200 { orderId: razorpayOrderId, amount: amountPaise, keyId: process.env.RAZORPAY_KEY_ID }`

---

**Task 13.2 — POST /webhooks/razorpay**

- No auth middleware — this is a public webhook endpoint; add HMAC-SHA256 signature verification:
  - Compute `expectedSig = HMAC-SHA256(razorpayWebhookSecret, rawBody)`
  - Compare with `X-Razorpay-Signature` header using `crypto.timingSafeEqual`; return 401 if mismatch
- Parse event; handle `payment.captured` event only:
  - Extract `razorpay_payment_id`, `razorpay_order_id`, `amount`, `notes` (should contain `userId` and `pricingTierId`)
  - Check `CreditTransaction` for existing row with `razorpayPaymentId = razorpay_payment_id`; if found, return 200 (idempotency)
  - Open Prisma transaction: increment `User.creditBalance` by `PricingTier.credits + bonusCredits`; insert `CreditTransaction` with `transactionType = "purchase"`, `razorpayPaymentId`, `paymentAmountInr`, `paymentStatus = "captured"`
  - Commit; return 200
- All other events: log and return 200

---

## Epic 14 — Credit Purchase UI & Transaction History

---

**Task 14.1 — GET /credit-packs (Student-facing Packs Endpoint)**

- No auth required (or student auth optional)
- Query `PricingTier` where `isActive = true`, ordered by `displayOrder ASC`, then `priceInr ASC`
- Return `200 { packs: [{ id, tierName, credits, bonusCredits, priceInr }] }`

---

**Task 14.2 — Credit Purchase Screen (Mobile)**

- Create `CreditPurchaseScreen`; on mount call `GET /credit-packs`
- Render pack cards in a `FlatList`: tier name, total credits (`credits + bonusCredits`), price in INR
- On pack tap: call `POST /payments/create-order`; on success open Razorpay React Native SDK with `{ orderId, amount, keyId }`
- On payment success callback: call `GET /credits/balance` and update global state (balance shows immediately); show success toast "Credits added!"
- On payment failure or cancellation: show dismissible error banner "Payment failed. Please try again." and remain on purchase screen
- Screen accessible from: zero-credit `BuyCreditsBottomSheet` CTA, and profile screen menu item

---

**Task 14.3 — Transaction History Screen (Mobile)**

- Create `TransactionHistoryScreen`; on mount call `GET /credits/transactions`
- Render `FlatList` of transaction rows: date, type badge ("Purchase" / "Deduction" / "Refund"), `creditsChange` (+N in green, -N in red), `balanceAfter`
- Implement pagination on `onEndReached`
- Empty state: "No transactions yet"

---

## Epic 15 — Analytics Data Pipeline

---

**Task 15.1 — GET /analytics/summary**

- Require student auth middleware
- `totalPapers`: count `PaperAttempt` where `userId` and `isCompleted = true`
- `overallAverage`: avg `percentage` across all completed `PaperAttempt` for user
- `currentStreak`: iterate `PaperAttempt.submittedAt` dates in DESC order; count consecutive calendar days ending today; reset if yesterday is missing
- `percentile`: count all users with ≥ 3 completed attempts; if total < 100, return `null`; else compute user's rank percentile using `percentage` scores
- Return `200 { totalPapers, overallAverage, currentStreak, percentile }`

---

**Task 15.2 — GET /analytics/topics**

- Require student auth middleware
- Group completed `PaperAttempt` records for user by `GeneratedPaper.examSubjectId`
- For each subject group: `averageScore`, `attemptCount`, `lastScore`, last 10 `{ submittedAt, percentage }` ordered by date ASC (for chart)
- Read `currentDifficulty` from `SystemConfig` key `difficulty:{userId}:{chapterId}` for each chapter
- Return `200 { topics: [{ examSubjectId, averageScore, attemptCount, lastScore, currentDifficulty, scoreHistory }] }`

---

**Task 15.3 — GET /analytics/heatmap**

- Require student auth middleware
- Fetch all `ExamSubject` chapters for the student's primary exam
- For each chapter, compute `averageScore` from completed `PaperAttempt` for that user; null if no attempts
- Return `200 { heatmap: [{ chapterId, chapterName, subjectId, averageScore }] }`

---

## Epic 16 — Student Analytics Dashboard UI

---

**Task 16.1 — Analytics Screen — Summary Cards (Mobile)**

- Create `AnalyticsScreen` accessible from bottom nav tab
- On mount, call `GET /analytics/summary`; show skeleton loaders while fetching
- Render 4 stat cards: "Total Papers", "Average Score", "Current Streak", "Percentile" — hide Percentile card entirely if API returns `null`
- Implement pull-to-refresh (`RefreshControl`) that re-fetches summary

---

**Task 16.2 — Score Trend Line Chart (Mobile)**

- Call `GET /analytics/topics` on mount
- Render a subject selector (horizontal chips); default to "All"
- For selected subject, render a line chart (use `react-native-chart-kit` or `Victory Native`) with last 10 score data points on Y-axis and dates on X-axis
- On point tap, show a tooltip `{ date, score% }`
- Handle edge case: 1 data point = single dot, ≥ 2 = line

---

**Task 16.3 — Topic Heatmap Grid (Mobile)**

- Call `GET /analytics/heatmap` on mount
- Render a grid of tiles (e.g., 3-column `FlatList`); each tile shows chapter name truncated
- Tile background colour: grey = null, red = `< 50`, amber = `50–74`, green = `≥ 75`
- Tapping a tile navigates to `TopicDetailScreen` for that chapter's `examSubjectId`
- Subject filter chips above grid; selecting a subject filters tiles to that subject only

---

## Epic 17 — Document Upload & Storage

---

**Task 17.1 — POST /admin/content/upload (S3 Upload + DB Record)**

- Require admin auth middleware
- Accept `multipart/form-data` with fields: `examId`, `subjectId`, `chapterId`, `file`
- Validate: `examId`, `subjectId`, `chapterId` all exist in DB; return 400 if any missing
- Validate file MIME type: only `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`; return 415 if invalid
- Validate file size ≤ 50MB; return 413 if exceeded
- Upload file to S3 bucket with key `content/{examId}/{subjectId}/{chapterId}/{uuid}-{filename}`
- Insert `UploadedContent` with `examId`, `subjectId`, `chapterId`, `fileName`, `fileType`, `s3Bucket`, `s3Key`, `fileSizeBytes`, `vectorizationStatus = "pending"`, `uploadedById = req.user.id`
- Enqueue BullMQ job `ingest-document` with `{ contentId }`
- Return `201 { contentId, fileName, vectorizationStatus: "pending" }`

---

**Task 17.2 — DELETE /admin/content/:contentId**

- Require admin auth middleware
- Fetch `UploadedContent` by `contentId`; return 404 if not found
- Delete S3 object using `s3.deleteObject({ Bucket, Key: s3Key })`
- Delete `UploadedContent` DB record
- Enqueue BullMQ job `delete-vectors` with `{ contentId }` (Pinecone cleanup handled in Epic 18)
- Return `200 { message: "Deleted" }`

---

**Task 17.3 — GET /admin/content?chapterId= (Document List)**

- Require admin auth middleware
- Accept `?chapterId=` query param; query `UploadedContent` filtered by `chapterId`, ordered by `uploadedAt DESC`
- Return `200 { documents: [{ contentId, fileName, fileType, vectorizationStatus, questionsExtracted, uploadedAt }] }`

---

## Epic 18 — Document Ingestion Pipeline

---

**Task 18.1 — BullMQ Worker: Text Extraction**

- Create `src/workers/ingestionWorker.ts`; register `ingest-document` queue processor
- Fetch `UploadedContent` by `contentId`; update `vectorizationStatus = "processing"`, `vectorizationStartedAt = now()`
- Download file from S3 to temp buffer
- If `fileType = "application/pdf"`, use `pdf-parse` to extract text; if DOCX, use `mammoth` to extract raw text
- On extraction error (corrupt file), update `vectorizationStatus = "failed"` with error note; throw to stop processing
- Pass extracted text to chunker function (Task 18.2)

---

**Task 18.2 — Text Chunker + OpenAI Embeddings**

- Create `src/services/textChunker.ts`
- Implement `chunkText(text: string): string[]` using sliding window: `chunk_size = 512` tokens (approx chars), `chunk_overlap = 50`; split on sentence boundaries where possible
- Create `src/services/embeddingService.ts`; export `embedChunks(chunks: string[]): Promise<number[][]>`
- Call `openai.embeddings.create({ model: "text-embedding-3-small", input: batch })` in batches of 100
- Return array of embedding vectors aligned with input chunks

---

**Task 18.3 — Pinecone Upsert + Status Update**

- Create `src/services/pineconeService.ts`; initialise Pinecone client with `apiKey` and `indexName` from env
- Export `upsertChunks(contentId, chunks, embeddings, metadata)`: build vector objects `{ id: "{contentId}:{chunkIndex}", values: embedding, metadata: { examId, subjectId, chapterId, contentId, chunkIndex } }`
- Before upserting, delete any existing vectors for `contentId` (rollback partial upsert): `index.deleteMany({ filter: { contentId } })`
- Upsert all vectors in batches of 100
- On success: update `UploadedContent.vectorizationStatus = "completed"`, `vectorizationCompletedAt = now()`, `questionsExtracted = chunks.length`

---

**Task 18.4 — Retry Logic + Vector Deletion Worker**

- Configure BullMQ `ingest-document` queue with `attempts: 3`, `backoff: { type: "exponential", delay: 5000 }`
- On `failed` event (all retries exhausted): update `UploadedContent.vectorizationStatus = "failed"`
- Register `delete-vectors` queue processor: accept `{ contentId }`; call `pineconeService.deleteByContentId(contentId)` — filter delete all vectors with `metadata.contentId = contentId`

---

## Epic 19 — RAG Retrieval Integration

---

**Task 19.1 — RAG Retrieval Service**

- Create `src/services/ragService.ts`
- Export `retrieveContext(chapterId: string, topicQuery: string): Promise<string>`
- Embed `topicQuery` using `openai.embeddings.create({ model: "text-embedding-3-small" })`
- Query Pinecone: `index.query({ vector: embedding, topK: 5, filter: { chapterId }, includeMetadata: true })`
- If query returns 0 matches, return empty string `""`
- Format top 5 chunks into a numbered context string: `"1. {chunk}\n2. {chunk}\n..."`
- Log at DEBUG: `paperId`, `chapterId`, retrieved chunk IDs and scores
- Return formatted context string

---

**Task 19.2 — Wire RAG into Paper Generation Worker**

- In `paperGenerationWorker.ts` (Task 07.4), before calling `promptBuilder`:
  - Derive `topicQuery` from chapter name (e.g., `"Generate MCQ questions about {chapterName}"`)
  - Call `ragService.retrieveContext(chapterId, topicQuery)`; store result as `ragContext`
  - Pass `ragContext` to `promptBuilder`
- If `ragService` throws or times out (> 500ms), catch error, log warning, and proceed with `ragContext = ""` (graceful fallback — generation must not fail due to RAG unavailability)

---

## Epic 20 — Configurable Prompt Templates

---

**Task 20.1 — GET /admin/prompt-templates (List All Templates)**

- Require admin auth middleware
- Query `AiPromptTemplate` joined with `ExamSubject` and `Subject`; order by `examSubjectId`, then `version DESC`
- Group by `examSubjectId`: return one active template per subject plus version count
- Return `200 { templates: [{ id, templateName, examSubjectId, subjectName, isActive, version, createdAt }] }`

---

**Task 20.2 — PUT /admin/prompt-templates/:examSubjectId (Save New Version)**

- Require `super_admin` role check; return 403 for `admin` role
- Accept `{ templateName, systemPrompt, generationRules }` in body
- Validate `systemPrompt` contains all 4 required variables: `{{topic}}`, `{{difficulty}}`, `{{rag_context}}`, `{{num_questions}}`; return 422 with list of missing variables if any absent
- Set `isActive = false` on current active template for this `examSubjectId`
- Insert new `AiPromptTemplate` with `isActive = true`, `version = previousVersion + 1`, `createdById = req.user.id`
- Return `201 { template: { id, version, isActive } }`

---

**Task 20.3 — POST /admin/prompt-templates/:id/preview**

- Require admin auth middleware (both roles)
- Fetch `AiPromptTemplate` by `id`; 404 if not found
- Substitute sample values: `{{topic}} → "Sample Chapter"`, `{{difficulty}} → "JEE Mains Level"`, `{{rag_context}} → "Sample context from documents."`, `{{num_questions}} → "10"`
- Return `200 { renderedPrompt: string }` — no DB writes, read-only

---

**Task 20.4 — Prompt Template Editor UI (Admin Web)**

- On Prompt Configuration page, list all subjects with current template `version` and `createdAt`
- `super_admin` sees "Edit" button; `admin` role sees no edit controls (read-only view)
- Edit opens a full-screen modal: `<textarea>` for `systemPrompt`; highlight `{{variable}}` tokens using a regex replace that wraps them in `<mark>` styled spans; sidebar shows variable reference list
- "Preview" button: call `POST /admin/prompt-templates/:id/preview`; display result in a read-only `<pre>` block inside the modal
- "Save" button: call `PUT /admin/prompt-templates/:examSubjectId`; on success show toast "Template saved (v{version})"; on 422 show inline error listing missing variables

---

## Epic 21 — Admin Auth & Dashboard Shell

---

**Task 21.1 — POST /admin/auth/login**

- Public endpoint (no JWT middleware)
- Accept `{ email, password }` in body
- Lookup `User` by `email` where `userType IN ("admin", "content_manager", "super_admin")`; return 401 generic error if not found (avoid email enumeration)
- `bcrypt.compare(password, User.passwordHash)`; return 401 if mismatch
- Derive admin role from `UserRole` join `Role`; determine if `super_admin` or `admin`
- Sign a session token (JWT) with `{ userId, role }` and set as HTTP-only, `SameSite=Strict` cookie with `maxAge = 8h`
- Update `User.lastLoginAt = now()`
- Return `200 { user: { email, role } }`

---

**Task 21.2 — Admin Auth Middleware**

- Extract session cookie; verify JWT; return 401 if missing or invalid
- Lookup `User`; check `userType` is not `student`; return 401 if student JWT presented
- Attach `req.adminUser = { id, email, role }` and call `next()`
- Export `requireRole(role: "admin" | "super_admin")` higher-order middleware: checks `req.adminUser.role` matches or is higher; return 403 if insufficient

---

**Task 21.3 — POST /admin/auth/logout**

- Require admin auth middleware
- Clear the session cookie by setting `maxAge = 0`
- Return `200 { message: "Logged out" }`

---

**Task 21.4 — Admin Dashboard Shell (Web UI)**

- Create a `AppShell` React component with a fixed sidebar and top bar
- Sidebar links: Students, Analytics, Credit Packs, Content, Prompts, Audit Log — conditionally render "Credit Packs" and "Prompts" only for `super_admin` role
- Top bar: shows logged-in `email` + `role` badge; "Logout" button calls `POST /admin/auth/logout` and redirects to `/admin/login`
- All admin routes wrapped in an `AdminRoute` guard component: checks for valid session cookie; redirects to `/admin/login` if absent
- Accessing a route outside role permission (e.g., `admin` hitting `/admin/prompts`) shows a 403 page component

---

## Epic 22 — Student User Management

---

**Task 22.1 — GET /admin/students (Search + Paginated List)**

- Require admin auth middleware
- Accept `?search=&page=1&limit=25` query params
- If `search` length ≥ 3: filter `User` by `phoneNumber ILIKE '%search%' OR email ILIKE '%search%'`
- Filter `userType = "student"` only
- Join `UserExamPreference` (primary) for exam name; return `creditBalance`, `isActive`
- Return `200 { students: [{ id, fullName, phoneNumber, email, examName, creditBalance, isActive }], pagination }`

---

**Task 22.2 — GET /admin/students/:id (Student Detail)**

- Require admin auth middleware
- Fetch `User` by `id` with `userType = "student"`; 404 if not found
- Fetch last 10 `PaperAttempt` ordered by `submittedAt DESC`: `{ paperId, percentage, submittedAt }`
- Fetch last 10 `CreditTransaction` ordered by `createdAt DESC`
- Fetch `UserExamPreference` for onboarding data
- Return `200 { student: { ...user, examPreferences, recentPapers, recentTransactions } }`

---

**Task 22.3 — PATCH /admin/students/:id/status (Disable / Enable)**

- Require admin auth middleware
- Accept `{ isActive: boolean }` in body
- If `isActive = false`: set `User.isActive = false`; delete Redis key `refresh:{userId}` to immediately revoke all sessions
- If `isActive = true`: set `User.isActive = true` (student can log in again on next attempt)
- Return `200 { userId, isActive }`
- _(Audit log entry wired in Epic 26 task)_

---

**Task 22.4 — Student Management UI (Admin Web)**

- Create `StudentsPage`: render a search input; debounce 400ms; call `GET /admin/students?search=&page=1` on change
- Render results in a table: name, phone, exam, balance, status badge (green "Active" / red "Disabled")
- Implement pagination controls below table
- Clicking a row navigates to `StudentDetailPage`
- `StudentDetailPage`: show onboarding data, last 10 papers table, last 10 transactions table, current balance; toggle switch for Active/Disabled — show confirmation dialog before calling `PATCH /admin/students/:id/status`

---

## Epic 23 — Platform Analytics Dashboard

---

**Task 23.1 — GET /admin/analytics/overview**

- Require admin auth middleware
- `dau`: count distinct `userId` from `PaperAttempt` where `submittedAt::date = today`
- `papersToday`: count `PaperAttempt` where `submittedAt::date = today` and `isCompleted = true`
- `totalRevenue`: sum `paymentAmountInr` from `CreditTransaction` where `transactionType = "purchase"` and `paymentStatus = "captured"`
- Return `200 { dau, papersToday, totalRevenue }`

---

**Task 23.2 — GET /admin/analytics/dau-chart?days=7|30**

- Require admin auth middleware
- Accept `?days=7` or `?days=30`
- Query `DailyMetric` for last N days ordered by `metricDate ASC`; return `activeUsers` per day
- If `DailyMetric` row for a day is missing, return 0 for that day (fill gaps)
- Return `200 { data: [{ date, activeUsers }] }`

---

**Task 23.3 — Daily Metrics Aggregation Cron Job**

- Create a cron job (node-cron or BullMQ scheduled job) that runs daily at 00:05 UTC
- For yesterday's date: compute `newSignups`, `activeUsers`, `papersGenerated`, `papersAttempted`, `creditsConsumed`, `creditsPurchased`, `totalRevenueInr` from raw tables
- Upsert `DailyMetric` for yesterday using these aggregated values
- This powers the DAU chart without real-time aggregation on every request

---

**Task 23.4 — Platform Analytics Dashboard UI (Admin Web)**

- Create `AnalyticsDashboardPage`; on mount call `GET /admin/analytics/overview` and `GET /admin/analytics/dau-chart?days=7`
- Render 3 headline cards: DAU, Papers Today, Total Revenue
- Render a line chart (Recharts or Chart.js) for DAU; add toggle buttons "7 Days" / "30 Days" — on toggle call the endpoint with updated `days` param
- Auto-refresh entire page data every 5 minutes using `setInterval`; add a manual "Refresh" button

---

## Epic 24 — Credit Pack Management

---

**Task 24.1 — GET /admin/credit-packs (All Packs including Inactive)**

- Require admin auth middleware
- Query all `PricingTier` records ordered by `displayOrder ASC`, `priceInr ASC`
- Return `200 { packs: [{ id, tierName, tierCode, credits, bonusCredits, priceInr, isActive, displayOrder }] }`

---

**Task 24.2 — POST /admin/credit-packs (Create Pack)**

- Require `super_admin` role
- Accept `{ tierName, tierCode, credits, bonusCredits?, priceInr, displayOrder? }` in body
- Validate: `tierName` non-empty, `credits > 0`, `priceInr > 0`, `tierCode` unique; return 400 with field errors if invalid
- Insert `PricingTier` with `isActive = true`
- _(Audit log entry wired in Epic 26)_
- Return `201 { pack }`

---

**Task 24.3 — PATCH /admin/credit-packs/:id (Edit Pack)**

- Require `super_admin` role
- Fetch `PricingTier` by `id`; return 404 if not found; return 400 if `isActive = false` (cannot edit inactive)
- Accept `{ tierName?, credits?, priceInr?, displayOrder? }` — partial update
- Validate same rules as create; update record
- _(Audit log entry wired in Epic 26)_
- Return `200 { pack }`

---

**Task 24.4 — PATCH /admin/credit-packs/:id/deactivate**

- Require `super_admin` role
- Count `PricingTier` where `isActive = true`; if count = 1 and this is the last active pack, return 400 "Cannot deactivate the last active credit pack"
- Set `PricingTier.isActive = false` for the given id
- _(Audit log entry wired in Epic 26)_
- Return `200 { message: "Pack deactivated" }`

---

**Task 24.5 — Credit Pack Management UI (Admin Web)**

- Create `CreditPacksPage`; call `GET /admin/credit-packs` on mount; render table with pack name, credits, price, status badge, Edit button, Deactivate button
- "Create Pack" button opens a modal form; on submit calls `POST /admin/credit-packs`; on success close modal and refresh list
- Edit button opens same modal pre-filled; on submit calls `PATCH /admin/credit-packs/:id`
- Deactivate button shows confirmation dialog; calls `PATCH /admin/credit-packs/:id/deactivate`; shows error toast if last pack guard triggers

---

## Epic 25 — Content & Prompt Admin UI

---

**Task 25.1 — Document Upload Form UI (Admin Web)**

- Create `DocumentUploadPage` under "Content Management" sidebar section
- Render 3 cascading dropdowns: Exam (calls `GET /admin/exams`), Subject (calls `GET /admin/subjects?examId=`), Chapter (calls `GET /admin/chapters?subjectId=`)
- Enable file picker only after all 3 are selected; enforce PDF/DOCX accept attribute; show error if wrong type selected; check file size < 50MB client-side before upload
- On Upload, call `POST /admin/content/upload` as `multipart/form-data`
- On success, append new document to the list below with "Processing" status badge

---

**Task 25.2 — Document List with Auto-Polling Status (Admin Web)**

- Below upload form, render document list for selected Chapter (call `GET /admin/content?chapterId=`)
- For any document with `vectorizationStatus = "processing"` or `"pending"`, poll `GET /admin/content?chapterId=` every 5 seconds
- Stop polling for a document when its status changes to `"completed"` or `"failed"`; update badge in-place
- Delete button: show confirmation dialog; call `DELETE /admin/content/:contentId`; remove from list on success

---

**Task 25.3 — Prompt Configuration Page UI (Admin Web)**

- Create `PromptConfigPage` under "Content Management" sidebar
- Call `GET /admin/prompt-templates`; render a table row per subject showing: subject name, current template version, last updated date
- `admin` role: no Edit button; row is read-only
- `super_admin` role: each row has an "Edit" button opening a full-screen modal
- Modal: `<textarea>` for `systemPrompt` with CSS to highlight `{{variable}}` tokens; sidebar div lists the 4 required variables with descriptions
- "Preview" button in modal calls `POST /admin/prompt-templates/:id/preview` and shows result in a `<pre>` block
- "Save" calls `PUT /admin/prompt-templates/:examSubjectId`; success shows toast; validation errors shown as red inline message below textarea

---

## Epic 26 — Audit Log

---

**Task 26.1 — Audit Log DB Table + Write Service**

- The existing schema has no `AuditLog` model — add it now as it is an explicit gap:
  - Create migration: `audit_logs` table with `id (uuid)`, `adminEmail (varchar)`, `adminRole (varchar)`, `actionType (varchar)`, `resourceType (varchar)`, `resourceId (varchar)`, `metadataSnapshot (jsonb)`, `createdAt (timestamp)`
  - Add corresponding Prisma model `AuditLog`
- Create `src/services/auditLogger.ts`; export `logAuditEvent({ adminUser, actionType, resourceType, resourceId, metadataSnapshot })` function
- Function inserts a row into `audit_logs`; it is a fire-and-forget (no await needed at call site for non-critical paths, but await for correctness)

---

**Task 26.2 — Wire Audit Log into All Trigger Points**

- Call `auditLogger.logAuditEvent(...)` in the following existing endpoints (no new endpoints needed):
  - `PATCH /admin/students/:id/status` → `actionType: "user_disable"` or `"user_enable"`, `resourceType: "user"`, snapshot `{ wasActive, isActive }`
  - `PUT /admin/prompt-templates/:examSubjectId` → `actionType: "prompt_template_update"`, snapshot `{ oldVersion, newVersion, oldSystemPrompt, newSystemPrompt }`
  - `POST /admin/credit-packs` → `actionType: "credit_pack_create"`, snapshot `{ pack }`
  - `PATCH /admin/credit-packs/:id` → `actionType: "credit_pack_edit"`, snapshot `{ before, after }`
  - `PATCH /admin/credit-packs/:id/deactivate` → `actionType: "credit_pack_deactivate"`, snapshot `{ packId }`
  - `DELETE /admin/content/:contentId` → `actionType: "document_delete"`, snapshot `{ fileName, s3Key }`
  - `POST /admin/auth/login` → `actionType: "admin_login"`, snapshot `{ email }`

---

**Task 26.3 — GET /admin/audit-logs (Filtered, Paginated)**

- Require admin auth middleware (both roles)
- Accept query params: `?page=1&limit=50&startDate=&endDate=&adminEmail=&actionType=`
- Build WHERE clause dynamically: apply `createdAt BETWEEN startDate AND endDate` if dates provided; filter by `adminEmail` if provided; filter by `actionType` if provided
- Order by `createdAt DESC`; paginate at 50 per page
- Return `200 { logs: [{ id, adminEmail, adminRole, actionType, resourceType, resourceId, metadataSnapshot, createdAt }], pagination }`

---

**Task 26.4 — Audit Log Screen (Admin Web)**

- Create `AuditLogPage`; on mount call `GET /admin/audit-logs`; render table in reverse-chronological order
- Columns: timestamp, admin email, role badge, action type, resource type, resource ID, metadata toggle (expand/collapse JSON snippet)
- Filter controls above table: date range pickers (`startDate`, `endDate`), admin email input, action type dropdown with all 7 action types
- "Apply Filters" button re-fetches with updated query params; "Reset" clears all filters
- Pagination controls below table; page size fixed at 50

---

**Task 26.5 — Append-Only Guard (No DELETE or PUT on Audit Logs)**

- Verify no `DELETE /admin/audit-logs/:id` or `PUT /admin/audit-logs/:id` route is registered in the Express router
- Add an explicit catch-all for these patterns in the admin router: `router.all('/audit-logs/:id', (req, res) => res.status(405).json({ error: "Method not allowed" }))`
- Add to OpenAPI spec that these methods return 405 — document is append-only
