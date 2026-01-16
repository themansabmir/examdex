import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui";
import { useUsers } from "../application/useUsers";

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div className="p-4 text-gray-500">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading users</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 p-1 rounded w-fit">
              {user.company.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
