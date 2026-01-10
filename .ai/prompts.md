# Common Prompts and Workflows

## 🎯 Quick Reference Prompts

### Getting Started

```
Read the .ai/ documentation to understand the codebase architecture,
conventions, and contribution rules before making any changes.
```

### Understanding the Codebase

```
Explain the architecture of [feature/component] including:
- File locations
- Data flow
- Dependencies
- Key functions/components
```

### Making Changes

```
Implement [feature] following these requirements:
1. Read .ai/context.md for architecture
2. Follow patterns in .ai/conventions.md
3. Apply rules from .ai/contribution-rules.md
4. Add tests
5. Update documentation
```

## 🔧 Feature Development Workflows

### Adding a New API Endpoint

**Prompt:**
```
Add a new API endpoint for [feature]:
- Method: [GET/POST/PUT/DELETE]
- Path: /api/[resource]
- Request: [describe request body/params]
- Response: [describe response format]
- Validation: [describe validation rules]
- Error handling: [describe error cases]

Follow the existing patterns in apps/api/src/routes/
Use Zod for validation
Add proper TypeScript types
Include error handling
Add tests
```

**Steps:**
1. Create route file in `apps/api/src/routes/[resource].ts`
2. Define Zod validation schema
3. Implement route handler with error handling
4. Add types to `packages/shared/src/types/`
5. Write tests
6. Update API documentation

### Adding a New React Component

**Prompt:**
```
Create a new React component [ComponentName] that:
- Purpose: [describe what it does]
- Props: [list required and optional props]
- Behavior: [describe interactions]
- Styling: [describe visual appearance]

Use TypeScript for props
Use TailwindCSS for styling
Follow shadcn/ui patterns
Make it accessible
Add proper error boundaries
```

**Steps:**
1. Create component file in `apps/web/src/components/[category]/[ComponentName].tsx`
2. Define TypeScript props interface
3. Implement component with hooks
4. Add TailwindCSS classes
5. Export from index
6. Add usage example
7. Write tests

### Adding Shared Utilities

**Prompt:**
```
Add a utility function to packages/shared that:
- Function name: [name]
- Purpose: [what it does]
- Parameters: [list parameters with types]
- Return value: [describe return type]
- Edge cases: [list edge cases to handle]

Make it pure (no side effects)
Add comprehensive tests
Include JSDoc comments
Export from index
```

## 🐛 Bug Fixing Workflows

### Debugging a Bug

**Prompt:**
```
Debug the following issue:
- Description: [describe the bug]
- Expected behavior: [what should happen]
- Actual behavior: [what actually happens]
- Steps to reproduce: [list steps]
- Affected files: [if known]

Steps:
1. Reproduce the bug
2. Write a failing test
3. Identify root cause
4. Fix the issue
5. Verify test passes
6. Check for similar bugs
```

### Fixing a Type Error

**Prompt:**
```
Fix TypeScript error in [file]:
- Error message: [paste error]
- Location: [file:line]

Analyze the error
Understand the type mismatch
Fix properly (don't use 'any' or '@ts-ignore')
Ensure related code still works
```

## 🔄 Refactoring Workflows

### Refactoring a Component

**Prompt:**
```
Refactor [ComponentName] to:
- Goal: [what to improve]
- Constraints: [what must stay the same]
- Approach: [suggested approach]

Maintain existing functionality
Keep tests passing
Improve code quality
Update documentation
Don't break consumers
```

### Extracting Shared Logic

**Prompt:**
```
Extract shared logic from [files] into:
- Location: packages/shared/src/[category]/
- Name: [utility/hook name]
- Purpose: [what it does]

Identify common patterns
Create reusable abstraction
Update all consumers
Add tests
Document usage
```

## 🧪 Testing Workflows

### Adding Tests

**Prompt:**
```
Add tests for [feature/function]:
- Unit tests for: [list units]
- Integration tests for: [list integrations]
- Edge cases: [list edge cases]
- Error cases: [list error scenarios]

Use appropriate testing library
Mock external dependencies
Test happy path and edge cases
Aim for >80% coverage
```

### Fixing Failing Tests

**Prompt:**
```
Fix failing test: [test name]
- Error: [error message]
- File: [test file]

Understand why it's failing
Fix the test or the code
Don't just skip the test
Ensure it's testing the right thing
```

## 📚 Documentation Workflows

### Updating Documentation

**Prompt:**
```
Update documentation for [feature]:
- What changed: [describe changes]
- Files to update: [list docs]
- New examples: [if needed]

Update README if user-facing
Update API docs if endpoints changed
Update .ai/ docs if architecture changed
Add code examples
Keep it concise
```

### Adding API Documentation

**Prompt:**
```
Document API endpoint:
- Method: [GET/POST/etc]
- Path: [/api/resource]
- Description: [what it does]
- Request format: [with example]
- Response format: [with example]
- Error responses: [list possible errors]
- Authentication: [if required]
```

## 🔍 Code Review Workflows

### Reviewing Code

**Prompt:**
```
Review the following changes:
[paste code or describe changes]

Check for:
- Correctness
- Code quality
- Test coverage
- Documentation
- Security issues
- Performance concerns
- Breaking changes
```

### Addressing Review Comments

**Prompt:**
```
Address review feedback:
[paste feedback]

Understand the concern
Make requested changes
Explain decisions if disagreeing
Update tests if needed
Respond to reviewer
```

## 🚀 Deployment Workflows

### Preparing for Deployment

**Prompt:**
```
Prepare [feature] for deployment:
- Environment variables: [list new vars]
- Database changes: [if any]
- Breaking changes: [if any]
- Rollback plan: [describe]

Update .env.example files
Update deployment docs
Test in staging
Create migration scripts if needed
Document rollback procedure
```

### Post-Deployment Verification

**Prompt:**
```
Verify deployment of [feature]:
- Check health endpoints
- Test critical paths
- Monitor error logs
- Verify metrics
- Test rollback if needed
```

## 🎨 UI/UX Workflows

### Implementing a Design

**Prompt:**
```
Implement design for [component/page]:
- Design reference: [link or description]
- Responsive behavior: [describe breakpoints]
- Interactions: [describe hover/click states]
- Accessibility: [ARIA labels, keyboard nav]

Use TailwindCSS
Match design exactly
Make it responsive
Ensure accessibility
Test on multiple devices
```

### Adding Animations

**Prompt:**
```
Add animation to [component]:
- Type: [transition/animation]
- Trigger: [on load/hover/click]
- Duration: [time]
- Easing: [ease function]

Use CSS transitions or Framer Motion
Keep it performant
Make it optional (prefers-reduced-motion)
Don't overdo it
```

## 🔐 Security Workflows

### Adding Authentication

**Prompt:**
```
Implement authentication for [feature]:
- Method: [JWT/session/OAuth]
- Protected routes: [list routes]
- User roles: [if applicable]
- Token storage: [where/how]

Follow security best practices
Hash passwords properly
Implement rate limiting
Add CSRF protection
Test thoroughly
```

### Fixing Security Issue

**Prompt:**
```
Fix security vulnerability:
- Issue: [describe vulnerability]
- Severity: [low/medium/high/critical]
- Affected code: [location]
- Fix approach: [how to fix]

Understand the vulnerability
Implement proper fix
Add tests to prevent regression
Update security docs
Consider similar issues elsewhere
```

## 📊 Performance Workflows

### Optimizing Performance

**Prompt:**
```
Optimize performance of [feature]:
- Current issue: [slow load/high memory/etc]
- Metrics: [current numbers]
- Target: [desired numbers]
- Constraints: [what can't change]

Profile the code
Identify bottlenecks
Implement optimizations
Measure improvements
Don't sacrifice readability
```

### Adding Caching

**Prompt:**
```
Add caching to [feature]:
- What to cache: [data/responses]
- Cache strategy: [LRU/TTL/etc]
- Invalidation: [when to clear]
- Storage: [memory/Redis/etc]

Implement cache layer
Add cache invalidation
Handle cache misses
Monitor cache hit rate
Document cache behavior
```

## 🔄 Migration Workflows

### Migrating to New Pattern

**Prompt:**
```
Migrate [old pattern] to [new pattern]:
- Reason: [why migrating]
- Scope: [what's affected]
- Approach: [migration strategy]
- Timeline: [all at once/gradual]

Create migration plan
Update incrementally
Keep both patterns working temporarily
Update tests
Update documentation
Remove old pattern when done
```

## 💡 Tips for Effective Prompts

### Be Specific
```
❌ "Add a button"
✅ "Add a primary button that submits the form, with loading state and error handling"
```

### Provide Context
```
❌ "Fix the bug"
✅ "Fix the bug where users can't submit the form when the email field is empty"
```

### Include Constraints
```
❌ "Make it faster"
✅ "Optimize the query to load in under 100ms without changing the API contract"
```

### Reference Documentation
```
✅ "Follow the patterns in .ai/conventions.md"
✅ "Use the architecture described in .ai/context.md"
✅ "Apply the rules from .ai/contribution-rules.md"
```

### Break Down Complex Tasks
```
❌ "Build the entire user management system"
✅ "First, add the user model and database schema"
✅ "Then, add the API endpoints for CRUD operations"
✅ "Finally, add the UI components"
```

## 🎯 Template Prompts

### Feature Request Template
```
Implement [feature name]:

Context:
- Why: [business reason]
- Users: [who will use it]
- Priority: [high/medium/low]

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Technical Details:
- Affected workspaces: [api/web/shared]
- Dependencies: [list dependencies]
- API changes: [if any]

Acceptance Criteria:
- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion 3]

Follow .ai/ documentation for conventions and patterns.
```

### Bug Report Template
```
Bug: [brief description]

Environment:
- Workspace: [api/web]
- Browser/Node version: [version]
- OS: [operating system]

Steps to Reproduce:
1. [step 1]
2. [step 2]
3. [step 3]

Expected Behavior:
[what should happen]

Actual Behavior:
[what actually happens]

Error Messages:
[paste any errors]

Suggested Fix:
[if you have ideas]
```
