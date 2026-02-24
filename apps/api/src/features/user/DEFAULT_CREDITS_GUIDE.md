# Default Credit Configuration

## Overview

When a new student registers, they automatically receive a default amount of credits from the master data table `default_credit_config`. This allows administrators to manage the initial credit allocation without changing the code.

## Database Schema

### `default_credit_config` table

- `id` (uuid): Configuration ID
- `credits_per_new_student` (int): Number of credits to assign to new registrations (default: 10)
- `description` (text): Optional description of the configuration
- `is_active` (boolean): Whether this config is active
- `updated_by` (uuid): Admin ID who made the last update
- `updated_at` (timestamp): Last update time
- `created_at` (timestamp): Creation time

## How It Works

### Registration Flow

```
1. New user signs up → 2. Registration saves user data
3. System queries default_credit_config table for active config
4. Fetches credits_per_new_student value (default: 10)
5. Creates user with creditBalance = fetched value
6. User now has default credits available
```

### Implementation

**In `user.repository.ts`:**

```typescript
async save(data) {
  // Get active default credits config
  const defaultConfig = await this.prisma.defaultCreditConfig.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  const defaultCredits = defaultConfig?.creditsPerNewStudent ?? 10;

  // Create user with default credits
  const user = await this.prisma.user.create({
    data: {
      // ... other fields
      creditBalance: defaultCredits,  // <-- Assigned from master data
    },
  });
}
```

## Admin API Endpoints

### 1. Get Current Default Credits

**Request:**

```http
GET /admin/default-credits
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "creditsPerNewStudent": 10
  }
}
```

### 2. Update Default Credits

**Request:**

```http
PUT /admin/default-credits
Authorization: Bearer <token>
Content-Type: application/json

{
  "creditsPerNewStudent": 20
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "creditsPerNewStudent": 20,
    "description": "Updated to 20 credits per new student",
    "isActive": true,
    "updatedAt": "2026-02-25T10:30:00.000Z"
  },
  "message": "Default credits updated to 20. New registrations will receive this amount."
}
```

### 3. Get Configuration History

**Request:**

```http
GET /admin/default-credits/history?limit=10
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "uuid",
        "creditsPerNewStudent": 20,
        "description": "Updated to 20 credits per new student",
        "isActive": true,
        "updatedAt": "2026-02-25T10:30:00.000Z",
        "createdAt": "2026-02-25T10:30:00.000Z"
      },
      {
        "id": "uuid",
        "creditsPerNewStudent": 10,
        "description": "Updated to 10 credits per new student",
        "isActive": false,
        "updatedAt": "2026-02-25T09:00:00.000Z",
        "createdAt": "2026-02-25T09:00:00.000Z"
      }
    ],
    "total": 2
  }
}
```

## Example: Changing Default Credits

**Scenario:** You want to increase default credits from 10 to 25 for new students.

```bash
curl -X PUT http://localhost:3000/api/admin/default-credits \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"creditsPerNewStudent": 25}'
```

**Result:**

- All users registering **after** this update will receive 25 credits
- Existing users' credits remain unchanged
- The old configuration is marked as inactive
- Change is logged in configuration history

## Database Query

Check the current default credits configuration:

```sql
-- Get active configuration
SELECT credits_per_new_student, description, updated_at
FROM default_credit_config
WHERE is_active = true
ORDER BY updated_at DESC
LIMIT 1;

-- See configuration history
SELECT credits_per_new_student, description, is_active, updated_at, created_at
FROM default_credit_config
ORDER BY created_at DESC;
```

## New User Credit Assignment Flow

```
User Registration Request
    ↓
User Service → save(userData)
    ↓
Query DefaultCreditConfig (active = true)
    ↓
Get creditsPerNewStudent value
    ↓
Create User with creditBalance = value
    ↓
User Account Created with Initial Credits
```

## Migration

The migration file creates the `default_credit_config` table and inserts the initial configuration:

```bash
npx prisma migrate deploy
```

This automatically:

- Creates the table with proper schema
- Adds foreign key to users table
- Inserts default configuration (10 credits)
- Creates performance indexes

## Error Handling

- **400 Bad Request**: Invalid creditsPerNewStudent (must be non-negative integer)
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User must be admin to update configuration

## Future Enhancements

- [ ] Role-based access control (only super_admin can change)
- [ ] Configuration for different user types (different defaults for different roles)
- [ ] Automated credit expiry settings
- [ ] Promotional credit tiers
- [ ] A/B testing for optimal default credit amount
