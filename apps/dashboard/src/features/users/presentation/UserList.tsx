import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Mail, User as UserIcon, MoreHorizontal, Plus } from "lucide-react";
import { useUsers } from "../application/useUsers";
import type { User } from "../domain/User";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { InviteUserForm } from "./InviteUserForm";
import { Badge } from "@/shared/ui/badge";

interface UserListProps {
  userType?: string;
  excludeStudent?: boolean;
}

export function UserList({ userType, excludeStudent }: UserListProps) {
  const { data: users, isLoading, error } = useUsers({ userType, excludeStudent });
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("fullName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("email") || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "userType",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("userType") as string;
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"} className="capitalize">
            {role.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {error && <div className="p-4 text-destructive">Error loading users</div>}
      <div className="flex justify-end">
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation email to a new team member.
              </DialogDescription>
            </DialogHeader>
            <InviteUserForm onSuccess={() => setIsInviteOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        enableGlobalFilter
        globalFilterPlaceholder="Search users..."
      />
    </div>
  );
}
