# Contributing to ExamDex

Thank you for your interest in contributing to ExamDex! This document provides guidelines and instructions for contributing.

## 🌟 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/yourusername/examdex.git
   cd examdex
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow

### 1. Make Your Changes

- Write clean, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation as needed

### 2. Test Your Changes

```bash
# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Build to ensure no errors
pnpm build
```

### 3. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(api): add user authentication endpoint"
git commit -m "fix(web): resolve navigation bug"
git commit -m "docs: update README with new features"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎯 Pull Request Guidelines

### PR Title

Use the same format as commit messages:
```
feat(api): add user authentication
```

### PR Description

Include:
- **What** - What changes were made
- **Why** - Why these changes were necessary
- **How** - How the changes were implemented
- **Testing** - How you tested the changes
- **Screenshots** - If UI changes were made

### PR Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits
- [ ] PR description is clear and complete

## 🏗️ Project Structure

```
examdex/
├── apps/
│   ├── api/              # Backend API
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/              # Frontend
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/           # Shared code
└── turbo.json
```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper types
- Export types/interfaces for reusability
- Use Zod for runtime validation

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Backend

- Use async/await for asynchronous code
- Implement proper error handling
- Add input validation with Zod
- Write RESTful API endpoints

### Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use shadcn/ui components when possible
- Keep styles consistent

## 🧪 Testing

### Writing Tests

```typescript
// Example test structure
describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test edge cases and error scenarios
- Write integration tests for critical paths

## 📚 Documentation

### Code Comments

```typescript
/**
 * Brief description of function
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 */
function exampleFunction(param1: string, param2: number): boolean {
  // Implementation
}
```

### README Updates

Update relevant documentation when:
- Adding new features
- Changing APIs
- Modifying setup process
- Adding dependencies

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 13.0]
- Node: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Screenshots**
If applicable
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Problem**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## 🔍 Code Review Process

1. **Automated Checks** - CI must pass
2. **Peer Review** - At least one approval required
3. **Maintainer Review** - Final approval from maintainer
4. **Merge** - Squash and merge to main

## 📞 Getting Help

- **Questions** - Open a discussion on GitHub
- **Bugs** - Create an issue
- **Chat** - Join our Slack/Discord (if available)

## 🎉 Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to ExamDex! 🚀
