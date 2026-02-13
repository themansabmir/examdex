import { useExamSubjects, useDeleteExamSubject } from "../application/useExamSubjects";
import { useExams } from "../../exam/application/useExams";
import { useSubjects } from "../../subject/application/useSubjects";
import { DataTable } from "@/shared/components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { type ExamSubject } from "../domain/ExamSubject";
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

export function ExamSubjectList() {
  const navigate = useNavigate();
  const { data: mappings, isLoading: isLoadingMappings } = useExamSubjects();
  const { data: exams, isLoading: isLoadingExams } = useExams();
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: deleteMapping } = useDeleteExamSubject();

  const getExamName = (id: string) => exams?.find((e) => e.id === id)?.examName || id;
  const getSubjectName = (id: string) => subjects?.find((s) => s.id === id)?.subjectName || id;

  const columns: ColumnDef<ExamSubject>[] = [
    {
      id: "examName",
      header: "Exam",
      cell: ({ row }) => getExamName(row.original.examId),
    },
    {
      id: "subjectName",
      header: "Subject",
      cell: ({ row }) => getSubjectName(row.original.subjectId),
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
                onClick={() => navigate(ROUTES.MASTER.EXAM_SUBJECTS.EDIT.replace(":id", item.id))}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this mapping?")) {
                    deleteMapping(item.id);
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

  const isLoading = isLoadingMappings || isLoadingExams || isLoadingSubjects;

  return (
    <DataTable
      columns={columns}
      data={mappings || []}
      isLoading={isLoading}
      enableGlobalFilter
      globalFilterPlaceholder="Search mappings..."
    />
  );
}
