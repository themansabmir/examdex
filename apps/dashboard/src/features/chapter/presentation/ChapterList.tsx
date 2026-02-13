import { type ColumnDef } from "@tanstack/react-table";
import type { Chapter } from "../domain/Chapter";
import { useChapters, useDeleteChapter } from "../application/useChapters";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Badge } from "@/shared/ui/badge";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

export function ChapterList() {
  const { data: chapters, isLoading } = useChapters();
  const { mutate: deleteChapter } = useDeleteChapter();
  const navigate = useNavigate();

  const columns: ColumnDef<Chapter>[] = [
    {
      accessorKey: "chapterCode",
      header: "Code",
    },
    {
      accessorKey: "chapterName",
      header: "Name",
    },
    {
      accessorKey: "subject.subjectName",
      header: "Subject",
      cell: ({ row }) => row.original.subject?.subjectName || "N/A",
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
        const chapter = row.original;

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
                onClick={() => navigate(ROUTES.MASTER.CHAPTERS.EDIT.replace(":id", chapter.id))}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      chapter and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteChapter(chapter.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={columns}
      data={chapters || []}
      enableGlobalFilter
      globalFilterPlaceholder="Filter chapters..."
      enablePagination
      enableColumnVisibility
    />
  );
}
