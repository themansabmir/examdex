// Centralized route configuration - single source of truth for all routes
// This ensures no discrepancy between router URLs and href URLs

export const ROUTES = {
  // Auth
  LOGIN: "/login",

  // Main routes
  DASHBOARD: "/",

  // Users
  USERS: {
    ROOT: "/users",
    LIST: "/users",
    ADMINS: "/users/admins",
    STUDENTS: "/users/students",
  },

  // Exams
  EXAMS: {
    ROOT: "/exams",
    LIST: "/exams",
    CREATE: "/exams/create",
    RESULTS: "/exams/results",
  },

  // Students
  STUDENTS: {
    ROOT: "/students",
    LIST: "/students",
    ENROLLMENTS: "/students/enrollments",
    PERFORMANCE: "/students/performance",
  },

  // Analytics
  ANALYTICS: {
    ROOT: "/analytics",
    DASHBOARD: "/analytics",
    TRENDS: "/analytics/trends",
  },

  // Reports
  REPORTS: {
    ROOT: "/reports",
    LIST: "/reports",
    SCHEDULED: "/reports/scheduled",
  },

  // Settings
  SETTINGS: {
    ROOT: "/settings",
    PREFERENCES: "/settings",
  },

  HELP: "/help",
} as const;

// Helper to check if a path matches a route (for active states)
export function isActiveRoute(currentPath: string, routePath: string): boolean {
  return currentPath === routePath || currentPath.startsWith(routePath + "/");
}
