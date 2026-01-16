import { AppProviders } from "./app/providers";
import { UserList } from "./features/users/presentation/UserList";
import { APP_CONFIG } from "@repo/config";
import "./index.css";

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">ExamDex Dashboard</h1>
          <div className="text-xs text-muted-foreground bg-white p-2 rounded border">
            Min Passing Score: {APP_CONFIG.EXAMS.MIN_PASSING_SCORE}%
          </div>
        </header>

        <section className="space-y-4 pt-8 border-t">
          <h2 className="text-xl font-bold">2. E2E Feature: Users (External API)</h2>
          <UserList />
        </section>
      </div>
    </AppProviders>
  );
}

export default App;
