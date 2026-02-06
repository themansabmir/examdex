import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateExamSchema, UpdateExamSchema, type ExamFormInput, type Exam } from "../domain/Exam";
import { useCreateExam, useUpdateExam } from "../application/useExams";
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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface ExamFormProps {
  initialData?: Exam;
}

export function ExamForm({ initialData }: ExamFormProps) {
  const navigate = useNavigate();
  const { mutate: createExam, isPending: isCreating } = useCreateExam();
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExam();

  const isEditing = !!initialData;

  const form = useForm<ExamFormInput>({
    resolver: zodResolver(isEditing ? UpdateExamSchema : CreateExamSchema),
    defaultValues: initialData
      ? {
          examCode: initialData.examCode,
          examName: initialData.examName,
          examFullName: initialData.examFullName || "",
          examBoard: initialData.examBoard || "",
          isPopular: initialData.isPopular,
          isActive: initialData.isActive,
        }
      : {
          examCode: "",
          examName: "",
          examFullName: "",
          examBoard: "",
          isPopular: false,
        },
  });

  const onSubmit = (data: ExamFormInput) => {
    if (isEditing) {
      updateExam(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.EXAMS.LIST),
        }
      );
    } else {
      createExam(data, {
        onSuccess: () => navigate(ROUTES.MASTER.EXAMS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Exam" : "Create Exam"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="examCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JEE-MAIN-2025" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the exam (cannot be changed later).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JEE Main" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Joint Entrance Examination - Main" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examBoard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NTA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Popular Exam</FormLabel>
                      <FormDescription>
                        Show this exam in the popular exams section.
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

              {isEditing && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Is this exam currently active?
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
                onClick={() => navigate(ROUTES.MASTER.EXAMS.LIST)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? "Update Exam" : "Create Exam"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
