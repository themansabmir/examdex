import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSubjectChapterSchema, UpdateSubjectChapterSchema, type SubjectChapterFormInput, type SubjectChapter } from "../domain/SubjectChapter";
import { useCreateSubjectChapter, useUpdateSubjectChapter } from "../application/useSubjectChapters";
import { useExamSubjects } from "../../exam-subject/application/useExamSubjects";
import { useExams } from "../../exam/application/useExams";
import { useSubjects } from "../../subject/application/useSubjects";
import { useChapters } from "../../chapter/application/useChapters";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface SubjectChapterFormProps {
  initialData?: SubjectChapter;
}

export function SubjectChapterForm({ initialData }: SubjectChapterFormProps) {
  const navigate = useNavigate();
  const { mutate: createMapping, isPending: isCreating } = useCreateSubjectChapter();
  const { mutate: updateMapping, isPending: isUpdating } = useUpdateSubjectChapter();

  const { data: examSubjects, isLoading: isLoadingES } = useExamSubjects();
  const { data: exams } = useExams();
  const { data: subjects } = useSubjects();
  const { data: chapters, isLoading: isLoadingChapters } = useChapters();

  const isEditing = !!initialData;

  const getESDisplay = (es: any) => {
    const examName = exams?.find((e) => e.id === es.examId)?.examName || es.examId;
    const subjectName = subjects?.find((s) => s.id === es.subjectId)?.subjectName || es.subjectId;
    return `${examName} - ${subjectName}`;
  };

  const form = useForm<SubjectChapterFormInput>({
    resolver: zodResolver(isEditing ? UpdateSubjectChapterSchema : CreateSubjectChapterSchema),
    defaultValues: initialData
      ? {
          examSubjectId: initialData.examSubjectId,
          chapterId: initialData.chapterId,
          chapterNumber: initialData.chapterNumber || undefined,
          weightagePercentage: initialData.weightagePercentage,
          isActive: initialData.isActive,
        }
      : {
          examSubjectId: "",
          chapterId: "",
          chapterNumber: undefined,
          weightagePercentage: 0,
          isActive: true,
        },
  });

  const onSubmit = (data: SubjectChapterFormInput) => {
    if (isEditing) {
      updateMapping(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.SUBJECT_CHAPTERS.LIST),
        }
      );
    } else {
      createMapping(data, {
        onSuccess: () => navigate(ROUTES.MASTER.SUBJECT_CHAPTERS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Subject-Chapter Mapping" : "Create Subject-Chapter Mapping"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="examSubjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam-Subject Mapping</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing || isLoadingES}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Exam-Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examSubjects?.map((es) => (
                          <SelectItem key={es.id} value={es.id}>
                            {getESDisplay(es)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chapterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing || isLoadingChapters}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a chapter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chapters?.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.chapterName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chapterNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightagePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weightage Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5.5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Is this mapping currently active?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.MASTER.SUBJECT_CHAPTERS.LIST)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? "Update Mapping" : "Create Mapping"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
