import { useSubjectChapters, useDeleteSubjectChapter } from "../application/useSubjectChapters";
import { useExamSubjects } from "../../exam-subject/application/useExamSubjects";
import { useExams } from "../../exam/application/useExams";
import { useSubjects } from "../../subject/application/useSubjects";
import { useChapters } from "../../chapter/application/useChapters";
import { DataTable } from "@/shared/components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { type SubjectChapter } from "../domain/SubjectChapter";
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

export function SubjectChapterList() {
  const navigate = useNavigate();
  const { data: mappings, isLoading: isLoadingMappings } = useSubjectChapters();
  const { data: examSubjects } = useExamSubjects();
  const { data: exams } = useExams();
  const { data: subjects } = useSubjects();
  const { data: chapters } = useChapters();
  const { mutate: deleteMapping } = useDeleteSubjectChapter();

  const getESDisplay = (esId: string) => {
    const es = examSubjects?.find((e) => e.id === esId);
    if (!es) return esId;
    const examName = exams?.find((e) => e.id === es.examId)?.examName || es.examId;
    const subjectName = subjects?.find((s) => s.id === es.subjectId)?.subjectName || es.subjectId;
    return `${examName} - ${subjectName}`;
  };

  const getChapterName = (id: string) => chapters?.find((c) => c.id === id)?.chapterName || id;

  const columns: ColumnDef<SubjectChapter>[] = [
    {
      id: "examSubject",
      header: "Exam-Subject",
      cell: ({ row }) => getESDisplay(row.original.examSubjectId),
    },
    {
      id: "chapterName",
      header: "Chapter",
      cell: ({ row }) => getChapterName(row.original.chapterId),
    },
    {
      accessorKey: "chapterNumber",
      header: "No.",
    },
    {
      accessorKey: "weightagePercentage",
      header: "Weightage (%)",
      cell: ({ row }) => `${row.original.weightagePercentage}%`,
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
                onClick={() => navigate(ROUTES.MASTER.SUBJECT_CHAPTERS.EDIT.replace(":id", item.id))}
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

  const isLoading = isLoadingMappings;

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
