import { useState, useEffect } from "react";
import { AppProviders } from "./app/providers";
import { UserList } from "./features/users/presentation/UserList";
import { LoginForm } from "./features/auth/presentation/LoginForm";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { APP_CONFIG } from "@repo/config";
import { Button, LogOut } from "@repo/ui";
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <AppProviders>
        <LoginForm />
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar - Fixed */}
        <aside className="hidden md:block w-64 fixed left-0 top-0 bottom-0">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64">
          {/* Mobile Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="container flex h-14 items-center">
              <MobileNav />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold tracking-tight">ExamDex</span>
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl">
            <div className="px-6 h-16 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Min Score: {APP_CONFIG.EXAMS.MIN_PASSING_SCORE}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold">{user?.fullName}</p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {user?.userType}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 p-6 md:p-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                  Access and manage all student accounts and administrative users across your
                  platforms.
                </p>
              </div>
              <Button className="btn-primary">Add New User</Button>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="radial-blur top-0 left-0" />
              <UserList />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t py-8 px-6 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
              <p>© 2026 ExamDex Systems. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a
                  href="#"
                  className="hover:text-foreground transition-colors tracking-tight font-medium"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors tracking-tight font-medium"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors tracking-tight font-medium"
                >
                  Help Center
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AppProviders>
  );
}

export default App;
