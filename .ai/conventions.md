# Coding Conventions and Standards

## 🎨 Code Style

### General Principles
- **Consistency** - Follow existing patterns
- **Readability** - Code is read more than written
- **Simplicity** - Prefer simple solutions over clever ones
- **DRY** - Don't Repeat Yourself (but don't over-abstract)
- **YAGNI** - You Aren't Gonna Need It (avoid premature optimization)

## 📝 TypeScript

### Type Definitions

**✅ DO:**
```typescript
// Explicit return types for functions
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Type for unions
type Status = 'pending' | 'active' | 'completed';

// Proper generic types
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

**❌ DON'T:**
```typescript
// Avoid 'any'
function process(data: any) { }

// Avoid implicit any
function calculate(x, y) { }

// Avoid type assertions unless necessary
const user = data as User;
```

### Naming Conventions

- **Interfaces/Types:** PascalCase - `UserProfile`, `ApiResponse`
- **Functions/Variables:** camelCase - `getUserData`, `isActive`
- **Constants:** UPPER_SNAKE_CASE - `MAX_RETRIES`, `API_BASE_URL`
- **Components:** PascalCase - `UserCard`, `NavigationBar`
- **Files:** kebab-case - `user-profile.ts`, `api-client.ts`

## ⚛️ React Conventions

### Component Structure

**✅ DO:**
```typescript
import { useState } from 'react';

interface UserCardProps {
  name: string;
  email: string;
  onDelete?: () => void;
}

export function UserCard({ name, email, onDelete }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{name}</h3>
      <p>{email}</p>
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  );
}
```

**❌ DON'T:**
```typescript
// Avoid default exports
export default function UserCard() { }

// Avoid prop drilling
function Parent() {
  return <Child data={data} user={user} config={config} theme={theme} />;
}

// Avoid inline object creation in JSX
<Component style={{ margin: 10 }} />
```

### Hooks

**✅ DO:**
```typescript
// Custom hooks start with 'use'
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}

// Proper dependency arrays
useEffect(() => {
  fetchData(id);
}, [id]);
```

**❌ DON'T:**
```typescript
// Don't call hooks conditionally
if (condition) {
  useEffect(() => { });
}

// Don't omit dependencies
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id' dependency
```

## 🎯 Backend Conventions

### Express Routes

**✅ DO:**
```typescript
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Input validation with Zod
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

router.post('/users', async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
```

**❌ DON'T:**
```typescript
// Don't skip validation
router.post('/users', (req, res) => {
  const user = createUser(req.body); // No validation!
});

// Don't use sync operations
router.get('/users', (req, res) => {
  const users = fs.readFileSync('users.json'); // Blocking!
  res.json(users);
});
```

### Error Handling

**✅ DO:**
```typescript
// Custom error classes
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Centralized error handler
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 🎨 Styling Conventions

### TailwindCSS

**✅ DO:**
```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// Extract repeated patterns to components
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {children}
    </div>
  );
}
```

**❌ DON'T:**
```typescript
// Avoid inline styles
<div style={{ padding: '16px', backgroundColor: 'white' }}>

// Avoid extremely long className strings
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 mb-4 mt-2">
```

## 📁 File Organization

### Directory Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── pages/               # Page components
├── types/               # TypeScript types
└── utils/               # Pure utility functions
```

### File Naming

- **Components:** `UserProfile.tsx`, `NavigationBar.tsx`
- **Hooks:** `useAuth.ts`, `useLocalStorage.ts`
- **Utils:** `format-date.ts`, `api-client.ts`
- **Types:** `user.types.ts`, `api.types.ts`
- **Tests:** `UserProfile.test.tsx`, `format-date.test.ts`

## 🧪 Testing Conventions

### Test Structure

**✅ DO:**
```typescript
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should sum item prices correctly', () => {
    const items = [
      { id: '1', price: 10 },
      { id: '2', price: 20 },
    ];
    expect(calculateTotal(items)).toBe(30);
  });

  it('should handle negative prices', () => {
    const items = [{ id: '1', price: -10 }];
    expect(calculateTotal(items)).toBe(-10);
  });
});
```

## 📝 Comments and Documentation

### JSDoc Comments

**✅ DO:**
```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user data
 * @throws {NotFoundError} When user doesn't exist
 */
async function fetchUser(userId: string): Promise<User> {
  // Implementation
}
```

### Inline Comments

**✅ DO:**
```typescript
// Calculate total with 10% discount for premium users
const total = isPremium ? price * 0.9 : price;

// TODO: Add caching to improve performance
// FIXME: Handle edge case when user is null
```

**❌ DON'T:**
```typescript
// Don't state the obvious
const x = 5; // Set x to 5

// Don't leave commented-out code
// const oldFunction = () => { };
```

## 🔄 Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add user authentication endpoint
fix(web): resolve navigation bug on mobile
docs: update README with deployment instructions
refactor(shared): simplify validation logic
```

### Branch Naming

- `feature/user-authentication`
- `fix/navigation-bug`
- `refactor/api-error-handling`
- `docs/update-readme`

## 🚀 Performance Best Practices

### Frontend
```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => computeExpensive(data), [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Backend
```typescript
// Use async/await consistently
async function processData(data: Data[]) {
  const results = await Promise.all(
    data.map(item => processItem(item))
  );
  return results;
}

// Implement pagination
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const users = await getUsers({ page, limit });
  res.json(users);
});
```

## 🔒 Security Best Practices

```typescript
// Sanitize user input
import { z } from 'zod';
const schema = z.string().max(100).regex(/^[a-zA-Z0-9\s]+$/);

// Use environment variables for secrets
const apiKey = process.env.API_KEY;

// Implement rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);
```

## ✅ Code Review Checklist

Before submitting code:

- [ ] Follows TypeScript conventions
- [ ] Proper error handling
- [ ] Input validation implemented
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.logs in production code
- [ ] No hardcoded values
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds
