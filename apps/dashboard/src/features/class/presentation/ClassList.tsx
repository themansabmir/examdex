import { useClasses, useDeleteClass } from "../application/useClasses";
import { DataTable } from "@/shared/components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { type Class } from "../domain/Class";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.config";
import { Badge } from "@/shared/ui/badge";

export function ClassList() {
  const navigate = useNavigate();
  const { data: classes, isLoading } = useClasses();
  const { mutate: deleteClass } = useDeleteClass();

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "classCode",
      header: "Class Code",
    },
    {
      accessorKey: "className",
      header: "Class Name",
    },
    {
      accessorKey: "displayOrder",
      header: "Display Order",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

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
              <DropdownMenuItem
                onClick={() => navigate(ROUTES.MASTER.CLASSES.EDIT.replace(":id", item.id))}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this class?")) {
                    deleteClass(item.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={classes || []}
      isLoading={isLoading}
      enableGlobalFilter
      globalFilterPlaceholder="Search classes..."
    />
  );
}
