import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateChapterSchema, UpdateChapterSchema, type ChapterFormInput, type Chapter } from "../domain/Chapter";
import { useCreateChapter, useUpdateChapter } from "../application/useChapters";
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

interface ChapterFormProps {
  initialData?: Chapter;
}

export function ChapterForm({ initialData }: ChapterFormProps) {
  const navigate = useNavigate();
  const { mutate: createChapter, isPending: isCreating } = useCreateChapter();
  const { mutate: updateChapter, isPending: isUpdating } = useUpdateChapter();
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects({ active: true });

  const isEditing = !!initialData;

  const form = useForm<ChapterFormInput>({
    resolver: zodResolver(isEditing ? UpdateChapterSchema : CreateChapterSchema),
    defaultValues: initialData
      ? {
          subjectId: initialData.subjectId,
          chapterCode: initialData.chapterCode,
          chapterName: initialData.chapterName,
          classId: initialData.classId || undefined,
          isActive: initialData.isActive,
        }
      : {
          subjectId: "",
          chapterCode: "",
          chapterName: "",
        },
  });

  const onSubmit = (data: ChapterFormInput) => {
    if (isEditing) {
      updateChapter(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.CHAPTERS.LIST),
        }
      );
    } else {
      createChapter(data, {
        onSuccess: () => navigate(ROUTES.MASTER.CHAPTERS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Chapter" : "Create Chapter"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="chapterCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. KINEMATICS" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the chapter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chapterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kinematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
               <FormField
               control={form.control}
               name="isActive"
               render={({ field }) => (
                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                   <div className="space-y-0.5">
                     <FormLabel className="text-base">Active Status</FormLabel>
                     <FormDescription>
                       Is this chapter currently active?
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

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.MASTER.CHAPTERS.LIST)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? "Update Chapter" : "Create Chapter"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
