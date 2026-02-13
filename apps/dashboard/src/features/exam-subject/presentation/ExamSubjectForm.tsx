import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateExamSubjectSchema, UpdateExamSubjectSchema, type ExamSubjectFormInput, type ExamSubject } from "../domain/ExamSubject";
import { useCreateExamSubject, useUpdateExamSubject } from "../application/useExamSubjects";
import { useExams } from "../../exam/application/useExams";
import { useSubjects } from "../../subject/application/useSubjects";
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

interface ExamSubjectFormProps {
  initialData?: ExamSubject;
}

export function ExamSubjectForm({ initialData }: ExamSubjectFormProps) {
  const navigate = useNavigate();
  const { mutate: createMapping, isPending: isCreating } = useCreateExamSubject();
  const { mutate: updateMapping, isPending: isUpdating } = useUpdateExamSubject();

  const { data: exams, isLoading: isLoadingExams } = useExams({ active: true });
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects({ active: true });

  const isEditing = !!initialData;

  const form = useForm<ExamSubjectFormInput>({
    resolver: zodResolver(isEditing ? UpdateExamSubjectSchema : CreateExamSubjectSchema),
    defaultValues: initialData
      ? {
          examId: initialData.examId,
          subjectId: initialData.subjectId,
          displayOrder: initialData.displayOrder || undefined,
          isActive: initialData.isActive,
        }
      : {
          examId: "",
          subjectId: "",
          displayOrder: undefined,
          isActive: true,
        },
  });

  const onSubmit = (data: ExamSubjectFormInput) => {
    if (isEditing) {
      updateMapping(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.EXAM_SUBJECTS.LIST),
        }
      );
    } else {
      createMapping(data, {
        onSuccess: () => navigate(ROUTES.MASTER.EXAM_SUBJECTS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Exam-Subject Mapping" : "Create Exam-Subject Mapping"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="examId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing || isLoadingExams}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exams?.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.examName}
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
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isEditing || isLoadingSubjects}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.subjectName}
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
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
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
                onClick={() => navigate(ROUTES.MASTER.EXAM_SUBJECTS.LIST)}
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
