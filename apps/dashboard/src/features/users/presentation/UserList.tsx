import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Mail,
  Building2,
  User as UserIcon,
} from "@repo/ui";
import { useUsers } from "../application/useUsers";

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div className="p-4 text-gray-500">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card
          key={user.id}
          className="group hover:shadow-xl transition-all duration-300 border-zinc-200/50 glass hover:-translate-y-1"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <UserIcon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-zinc-400" />
              <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-sm">
                {user.company.name}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
