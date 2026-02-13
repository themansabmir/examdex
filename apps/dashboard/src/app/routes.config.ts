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

  // Master
  MASTER: {
    ROOT: "/master",
    EXAMS: {
      LIST: "/master/exams",
      CREATE: "/master/exams/create",
      EDIT: "/master/exams/edit/:id",
    },
    SUBJECTS: {
      LIST: "/master/subjects",
      CREATE: "/master/subjects/create",
      EDIT: "/master/subjects/edit/:id",
    },
    CHAPTERS: {
      LIST: "/master/chapters",
      CREATE: "/master/chapters/create",
      EDIT: "/master/chapters/edit/:id",
    },
    CLASSES: {
      LIST: "/master/classes",
      CREATE: "/master/classes/create",
      EDIT: "/master/classes/edit/:id",
    },
    EXAM_SUBJECTS: {
      LIST: "/master/exam-subjects",
      CREATE: "/master/exam-subjects/create",
      EDIT: "/master/exam-subjects/edit/:id",
    },
    SUBJECT_CHAPTERS: {
      LIST: "/master/subject-chapters",
      CREATE: "/master/subject-chapters/create",
      EDIT: "/master/subject-chapters/edit/:id",
    },
    PRICING_TIERS: {
      LIST: "/master/pricing-tiers",
      CREATE: "/master/pricing-tiers/create",
      EDIT: "/master/pricing-tiers/edit/:id",
    },
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
      title: "Master",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Exams",
          url: ROUTES.MASTER.EXAMS.LIST,
        },
        {
          title: "Subjects",
          url: ROUTES.MASTER.SUBJECTS.LIST,
        },
        {
          title: "Chapters",
          url: ROUTES.MASTER.CHAPTERS.LIST,
        },
        {
          title: "Classes",
          url: ROUTES.MASTER.CLASSES.LIST,
        },
        {
          title: "Exam-Subject Mappings",
          url: ROUTES.MASTER.EXAM_SUBJECTS.LIST,
        },
        {
          title: "Subject-Chapter Mappings",
          url: ROUTES.MASTER.SUBJECT_CHAPTERS.LIST,
        },
        {
          title: "Pricing Tiers",
          url: ROUTES.MASTER.PRICING_TIERS.LIST,
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
