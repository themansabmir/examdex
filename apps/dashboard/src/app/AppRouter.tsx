import { createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "./routes.config";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./layout";
import { LoginForm } from "@/features/auth/presentation/LoginForm";
import { UserList } from "@/features/users/presentation/UserList";

import { ExamList } from "@/features/exam/presentation/ExamList";
import { ExamForm } from "@/features/exam/presentation/ExamForm";
import { useExam } from "@/features/exam/application/useExams";

import { SubjectList } from "@/features/subject/presentation/SubjectList";
import { SubjectForm } from "@/features/subject/presentation/SubjectForm";
import { useSubject } from "@/features/subject/application/useSubjects";

import { ChapterList } from "@/features/chapter/presentation/ChapterList";
import { ChapterForm } from "@/features/chapter/presentation/ChapterForm";
import { useChapter } from "@/features/chapter/application/useChapters";

// Page components (will create placeholders)
function DashboardPage() {
  return (
    <DashboardLayout
      header={{
        title: "Dashboard",
        description: "Overview of your exam platform",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Dashboard Content Coming Soon</div>
    </DashboardLayout>
  );
}

function UsersPage() {
  return (
    <DashboardLayout
      header={{
        title: "Users",
        description:
          "Access and manage all student accounts and administrative users across your platforms.",
        action: {
          label: "Add New User",
          onClick: () => console.log("Add user clicked"),
        },
      }}
    >
      <UserList />
    </DashboardLayout>
  );
}

function AdminsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Admins",
        description: "Manage administrative users",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Admins List Coming Soon</div>
    </DashboardLayout>
  );
}

function StudentsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Students",
        description: "Manage student users",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Students List Coming Soon</div>
    </DashboardLayout>
  );
}

function ExamsPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout
      header={{
        title: "Exams",
        description: "View and manage all exams",
        action: {
          label: "Create Exam",
          onClick: () => navigate(ROUTES.MASTER.EXAMS.CREATE),
        },
      }}
    >
      <ExamList />
    </DashboardLayout>
  );
}

function CreateExamPage() {
  return (
    <DashboardLayout
      header={{
        title: "Create Exam",
        description: "Create a new exam",
      }}
    >
      <ExamForm />
    </DashboardLayout>
  );
}

function EditExamPage() {
  const { id } = useParams();
  const { data: exam, isLoading } = useExam(id);

  return (
    <DashboardLayout
      header={{
        title: "Edit Exam",
        description: `Edit details for ${exam?.examName || "exam"}`,
      }}
    >
      {isLoading ? <div>Loading...</div> : <ExamForm initialData={exam} />}
    </DashboardLayout>
  );
}

function SubjectsPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout
      header={{
        title: "Subjects",
        description: "View and manage all subjects",
        action: {
          label: "Create Subject",
          onClick: () => navigate(ROUTES.MASTER.SUBJECTS.CREATE),
        },
      }}
    >
      <SubjectList />
    </DashboardLayout>
  );
}

function CreateSubjectPage() {
  return (
    <DashboardLayout
      header={{
        title: "Create Subject",
        description: "Create a new subject",
      }}
    >
      <SubjectForm />
    </DashboardLayout>
  );
}

function EditSubjectPage() {
  const { id } = useParams();
  const { data: subject, isLoading } = useSubject(id);

  return (
    <DashboardLayout
      header={{
        title: "Edit Subject",
        description: `Edit details for ${subject?.subjectName || "subject"}`,
      }}
    >
      {isLoading ? <div>Loading...</div> : <SubjectForm initialData={subject} />}
    </DashboardLayout>
  );
}

function ChaptersPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout
      header={{
        title: "Chapters",
        description: "View and manage all chapters",
        action: {
          label: "Create Chapter",
          onClick: () => navigate(ROUTES.MASTER.CHAPTERS.CREATE),
        },
      }}
    >
      <ChapterList />
    </DashboardLayout>
  );
}

function CreateChapterPage() {
  return (
    <DashboardLayout
      header={{
        title: "Create Chapter",
        description: "Create a new chapter",
      }}
    >
      <ChapterForm />
    </DashboardLayout>
  );
}

function EditChapterPage() {
  const { id } = useParams();
  const { data: chapter, isLoading } = useChapter(id);

  return (
    <DashboardLayout
      header={{
        title: "Edit Chapter",
        description: `Edit details for ${chapter?.chapterName || "chapter"}`,
      }}
    >
      {isLoading ? <div>Loading...</div> : <ChapterForm initialData={chapter} />}
    </DashboardLayout>
  );
}

function ExamResultsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Exam Results",
        description: "View exam results",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Exam Results Coming Soon</div>
    </DashboardLayout>
  );
}

function StudentsListPage() {
  return (
    <DashboardLayout
      header={{
        title: "Students",
        description: "View all students",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Students List Coming Soon</div>
    </DashboardLayout>
  );
}

function EnrollmentsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Enrollments",
        description: "Manage student enrollments",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Enrollments Coming Soon</div>
    </DashboardLayout>
  );
}

function PerformancePage() {
  return (
    <DashboardLayout
      header={{
        title: "Performance",
        description: "Student performance analytics",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Performance Analytics Coming Soon</div>
    </DashboardLayout>
  );
}

function AnalyticsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Analytics",
        description: "Platform analytics overview",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Analytics Dashboard Coming Soon</div>
    </DashboardLayout>
  );
}

function TrendsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Trends",
        description: "Analytics trends over time",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Trends Coming Soon</div>
    </DashboardLayout>
  );
}

function ReportsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Reports",
        description: "Generated reports",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Reports Coming Soon</div>
    </DashboardLayout>
  );
}

function ScheduledReportsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Scheduled Reports",
        description: "Manage scheduled reports",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Scheduled Reports Coming Soon</div>
    </DashboardLayout>
  );
}

function SettingsPage() {
  return (
    <DashboardLayout
      header={{
        title: "Settings",
        description: "Manage your preferences",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Settings Coming Soon</div>
    </DashboardLayout>
  );
}

function HelpPage() {
  return (
    <DashboardLayout
      header={{
        title: "Help",
        description: "Help center and documentation",
      }}
    >
      <div className="p-8 text-center text-muted-foreground">Help Center Coming Soon</div>
    </DashboardLayout>
  );
}

// Layout wrapper for protected routes
function ProtectedLayout() {
  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <Outlet />
    </ProtectedRoute>
  );
}

// Centralized router configuration
const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginForm />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.USERS.LIST, element: <UsersPage /> },
      { path: ROUTES.USERS.ADMINS, element: <AdminsPage /> },
      { path: ROUTES.USERS.STUDENTS, element: <StudentsPage /> },

      // Master Data
      { path: ROUTES.MASTER.EXAMS.LIST, element: <ExamsPage /> },
      { path: ROUTES.MASTER.EXAMS.CREATE, element: <CreateExamPage /> },
      { path: ROUTES.MASTER.EXAMS.EDIT, element: <EditExamPage /> },

      { path: ROUTES.MASTER.SUBJECTS.LIST, element: <SubjectsPage /> },
      { path: ROUTES.MASTER.SUBJECTS.CREATE, element: <CreateSubjectPage /> },
      { path: ROUTES.MASTER.SUBJECTS.EDIT, element: <EditSubjectPage /> },

      { path: ROUTES.MASTER.CHAPTERS.LIST, element: <ChaptersPage /> },
      { path: ROUTES.MASTER.CHAPTERS.CREATE, element: <CreateChapterPage /> },
      { path: ROUTES.MASTER.CHAPTERS.EDIT, element: <EditChapterPage /> },

      { path: ROUTES.EXAMS.LIST, element: <ExamsPage /> },
      { path: ROUTES.EXAMS.CREATE, element: <CreateExamPage /> },
      { path: ROUTES.EXAMS.RESULTS, element: <ExamResultsPage /> },
      { path: ROUTES.STUDENTS.LIST, element: <StudentsListPage /> },
      { path: ROUTES.STUDENTS.ENROLLMENTS, element: <EnrollmentsPage /> },
      { path: ROUTES.STUDENTS.PERFORMANCE, element: <PerformancePage /> },
      { path: ROUTES.ANALYTICS.DASHBOARD, element: <AnalyticsPage /> },
      { path: ROUTES.ANALYTICS.TRENDS, element: <TrendsPage /> },
      { path: ROUTES.REPORTS.LIST, element: <ReportsPage /> },
      { path: ROUTES.REPORTS.SCHEDULED, element: <ScheduledReportsPage /> },
      { path: ROUTES.SETTINGS.PREFERENCES, element: <SettingsPage /> },
      { path: ROUTES.HELP, element: <HelpPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
