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

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading users...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading users</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card key={user.id} className="group hover-lift border-border/50 glass card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="icon-container-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
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
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="badge-secondary shadow-sm">{user.company.name}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
