import { useState, useEffect } from "react";
import { AppProviders } from "./app/providers";
import { UserList } from "./features/users/presentation/UserList";
import { LoginForm } from "./features/auth/presentation/LoginForm";
import { APP_CONFIG } from "@repo/config";
import { Button } from "@repo/ui";
import { LogOut } from "@repo/ui";
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col selection:bg-primary selection:text-white">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center sm:px-8">
            <div className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white dark:text-zinc-950 font-black text-lg">E</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight">ExamDex</h1>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold leading-none">
                  Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Min Score: {APP_CONFIG.EXAMS.MIN_PASSING_SCORE}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{user?.fullName}</p>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                    {user?.userType}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-zinc-100 dark:border-zinc-800 p-0.5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-full w-full rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 sm:px-8">
          <div className="space-y-10">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Users
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg">
                  Access and manage all student accounts and administrative users across your
                  platforms.
                </p>
              </div>
              <Button className="bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 h-11 px-6 font-semibold shadow-xl hover:shadow-2xl hover:bg-zinc-800 transition-all active:scale-[0.98]">
                Add New User
              </Button>
            </header>

            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent -z-10 rounded-3xl blur-3xl opacity-50" />
              <UserList />
            </section>
          </div>
        </main>

        <footer className="border-t py-8 px-8 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-xs">
            <p>© 2026 ExamDex Systems. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="hover:text-zinc-950 transition-colors tracking-tight font-medium"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-zinc-950 transition-colors tracking-tight font-medium"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-zinc-950 transition-colors tracking-tight font-medium"
              >
                Help Center
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AppProviders>
  );
}

export default App;
