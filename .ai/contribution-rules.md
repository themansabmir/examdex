# AI Agent Contribution Rules

## 🤖 Core Principles for AI Agents

### 1. Context First
- **Always** read relevant `.ai/` documentation before making changes
- Understand the full context of the request
- Review existing code patterns in the affected area
- Check related files and dependencies

### 2. Incremental Changes
- Make small, focused changes rather than large refactors
- One logical change per commit
- Test each change before moving to the next
- Avoid changing multiple unrelated things at once

### 3. Preserve Intent
- Maintain existing patterns unless explicitly asked to change them
- Don't "improve" code that wasn't requested
- Keep backward compatibility unless breaking changes are approved
- Respect the existing architecture

### 4. Explicit Over Implicit
- Ask for clarification when requirements are ambiguous
- State assumptions clearly
- Explain non-obvious decisions
- Document complex logic

## ✅ Required Actions

### Before Making Changes

1. **Read Context**
   - Review `.ai/context.md` for architecture understanding
   - Check `.ai/conventions.md` for coding standards
   - Look at similar existing code for patterns

2. **Verify Scope**
   - Confirm which workspace(s) are affected
   - Check for dependencies between workspaces
   - Identify files that need updates

3. **Plan Changes**
   - List all files that will be modified
   - Identify potential side effects
   - Consider testing requirements

### While Making Changes

1. **Follow Conventions**
   - Use existing code style
   - Match naming patterns
   - Follow file organization structure
   - Maintain TypeScript type safety

2. **Maintain Quality**
   - Add proper error handling
   - Include input validation
   - Write clear, self-documenting code
   - Add comments for complex logic

3. **Update Related Code**
   - Update types when changing interfaces
   - Update tests when changing behavior
   - Update documentation when changing APIs
   - Update environment examples when adding config

### After Making Changes

1. **Verify Changes**
   - Ensure linting passes
   - Ensure type checking passes
   - Ensure build succeeds
   - Test the changed functionality

2. **Update Documentation**
   - Update README if user-facing changes
   - Update API docs if endpoints changed
   - Update comments if logic changed
   - Update `.ai/` docs if architecture changed

## 🚫 Prohibited Actions

### Never Do These Without Explicit Permission

1. **Delete or Weaken Tests**
   - Don't remove test cases
   - Don't skip test assertions
   - Don't comment out failing tests
   - Don't reduce test coverage

2. **Break Existing Functionality**
   - Don't change public APIs without migration plan
   - Don't remove features without confirmation
   - Don't break backward compatibility
   - Don't introduce breaking changes silently

3. **Introduce Security Issues**
   - Don't hardcode secrets or API keys
   - Don't disable security features
   - Don't skip input validation
   - Don't expose sensitive data

4. **Bypass Quality Checks**
   - Don't use `@ts-ignore` without justification
   - Don't use `any` type unnecessarily
   - Don't disable ESLint rules without reason
   - Don't skip error handling

5. **Make Unauthorized Changes**
   - Don't refactor unrelated code
   - Don't change dependencies without discussion
   - Don't modify build configuration unnecessarily
   - Don't alter CI/CD pipelines without approval

## 📋 Change Checklist

Before submitting changes, verify:

### Code Quality
- [ ] Follows TypeScript conventions
- [ ] No `any` types (or justified)
- [ ] Proper error handling implemented
- [ ] Input validation added
- [ ] No hardcoded values
- [ ] No console.logs in production code

### Testing
- [ ] Existing tests still pass
- [ ] New tests added for new functionality
- [ ] Edge cases covered
- [ ] Error cases tested

### Documentation
- [ ] Code comments added where needed
- [ ] JSDoc comments for public functions
- [ ] README updated if needed
- [ ] API docs updated if endpoints changed

### Build & Deploy
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] No new warnings introduced

### Dependencies
- [ ] No unnecessary dependencies added
- [ ] Existing dependencies not broken
- [ ] Shared package changes reflected in consumers
- [ ] Package versions compatible

## 🎯 Common Scenarios

### Adding a New API Endpoint

1. Create route handler in `apps/api/src/routes/`
2. Add validation schema with Zod
3. Implement controller logic
4. Add error handling
5. Update API types in `packages/shared/`
6. Add tests
7. Update API documentation

### Adding a New React Component

1. Create component in appropriate directory
2. Define TypeScript props interface
3. Implement component with proper hooks
4. Add TailwindCSS styling
5. Export from index file
6. Add to Storybook (if applicable)
7. Add tests

### Modifying Shared Types

1. Update type in `packages/shared/`
2. Update all consumers in `apps/api/`
3. Update all consumers in `apps/web/`
4. Update validation schemas
5. Update tests
6. Verify builds succeed

### Fixing a Bug

1. Write a test that reproduces the bug
2. Verify the test fails
3. Fix the bug
4. Verify the test passes
5. Check for similar bugs elsewhere
6. Update documentation if needed

## 🔍 Code Review Guidelines

### What to Look For

**Correctness**
- Does it solve the stated problem?
- Are edge cases handled?
- Is error handling comprehensive?

**Quality**
- Is the code readable?
- Are names descriptive?
- Is complexity justified?
- Are patterns consistent?

**Safety**
- Are inputs validated?
- Are errors handled properly?
- Are types correct?
- Are security best practices followed?

**Maintainability**
- Is the code well-documented?
- Are tests comprehensive?
- Is the change localized?
- Will it be easy to modify later?

## 🚨 When to Stop and Ask

Stop and ask for clarification when:

1. **Requirements are Unclear**
   - Multiple valid interpretations exist
   - Expected behavior is ambiguous
   - Success criteria are not defined

2. **Breaking Changes Needed**
   - Public API must change
   - Database schema must change
   - Configuration format must change

3. **Major Architectural Decisions**
   - New dependencies required
   - New patterns introduced
   - Significant refactoring needed

4. **Security Concerns**
   - Handling sensitive data
   - Authentication/authorization changes
   - External API integration

5. **Performance Impact**
   - Changes affect critical path
   - Database queries modified
   - Large data processing added

## 📊 Quality Metrics

Aim for these standards:

- **Test Coverage:** >80%
- **Type Safety:** 100% (no `any` without justification)
- **Linting:** 0 errors, 0 warnings
- **Build Time:** No significant increase
- **Bundle Size:** No significant increase (frontend)
- **Response Time:** No degradation (backend)

## 🎓 Learning from Feedback

When receiving feedback:

1. **Understand the Issue**
   - Read feedback carefully
   - Ask questions if unclear
   - Identify root cause

2. **Apply the Fix**
   - Address the specific issue
   - Check for similar issues elsewhere
   - Update your understanding

3. **Update Knowledge**
   - Note patterns to follow
   - Note patterns to avoid
   - Update `.ai/` docs if needed

## 🔄 Iterative Improvement

1. **Start Simple**
   - Implement basic functionality first
   - Get it working correctly
   - Then optimize if needed

2. **Gather Feedback**
   - Test the implementation
   - Review with team (if applicable)
   - Iterate based on feedback

3. **Refine**
   - Improve code quality
   - Add edge case handling
   - Enhance documentation

## 🎯 Success Criteria

A successful contribution:

- ✅ Solves the stated problem completely
- ✅ Follows all coding conventions
- ✅ Includes comprehensive tests
- ✅ Has clear documentation
- ✅ Passes all quality checks
- ✅ Maintains backward compatibility
- ✅ Doesn't introduce technical debt
- ✅ Is reviewed and approved

## 🤝 Collaboration

When working with other agents or developers:

1. **Communicate Changes**
   - Describe what you're changing
   - Explain why changes are needed
   - Note any side effects

2. **Coordinate Work**
   - Avoid conflicting changes
   - Share context and decisions
   - Review each other's work

3. **Share Knowledge**
   - Document learnings
   - Update `.ai/` documentation
   - Help others understand the codebase

## 📝 Final Notes

- **Quality over Speed** - Take time to do it right
- **Ask Questions** - Better to clarify than assume
- **Test Thoroughly** - Bugs are expensive to fix later
- **Document Well** - Future you will thank present you
- **Stay Consistent** - Follow existing patterns
- **Be Humble** - Accept feedback gracefully
- **Keep Learning** - Every contribution teaches something
