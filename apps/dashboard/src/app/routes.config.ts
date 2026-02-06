import { BookOpen, Bot, GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";

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
  MASTER: {
    ROOT: "/master",
    SUBJECTS: "/master/subjects",
    CHAPTERS: "/master/chapters",
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

export const SidebarRoutes = {
  user: {
    name: "Examdex",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Examdex",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: ROUTES.DASHBOARD,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Users",
      url: ROUTES.USERS.LIST,
      icon: Bot,
    },
    {
      title: "Master Data",
      url: ROUTES.EXAMS.LIST,
      icon: BookOpen,
      items: [
        {
          title: "Exams",
          url: ROUTES.EXAMS.LIST,
        },
        {
          title: "Subjects",
          url: ROUTES.MASTER.SUBJECTS,
        },
        {
          title: "Chapters",
          url: ROUTES.MASTER.CHAPTERS,
        },
      ],
    },
    {
      title: "Students",
      url: ROUTES.USERS.STUDENTS,
      icon: Settings2,
      items: [
        {
          title: "All Students",
          url: ROUTES.USERS.STUDENTS,
        },
        {
          title: "Add Student",
          url: ROUTES.USERS.STUDENTS + "/add",
        },
        {
          title: "Student Progress",
          url: ROUTES.USERS.STUDENTS + "/progress",
        },
      ],
    },
  ],
  projects: undefined,
  // projects: [
  //   {
  //     name: "Analytics",
  //     url: ROUTES.ANALYTICS.DASHBOARD,
  //     icon: Frame,
  //   },
  //   {
  //     name: "Reports",
  //     url: ROUTES.REPORTS.LIST,
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Settings",
  //     url: ROUTES.SETTINGS.PREFERENCES,
  //     icon: Map,
  //   },
  // ],
};
