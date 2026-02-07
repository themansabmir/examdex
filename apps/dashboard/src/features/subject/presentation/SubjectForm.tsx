import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSubjectSchema, UpdateSubjectSchema, type SubjectFormInput, type Subject } from "../domain/Subject";
import { useCreateSubject, useUpdateSubject } from "../application/useSubjects";
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

interface SubjectFormProps {
  initialData?: Subject;
}

export function SubjectForm({ initialData }: SubjectFormProps) {
  const navigate = useNavigate();
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();

  const isEditing = !!initialData;

  const form = useForm<SubjectFormInput>({
    resolver: zodResolver(isEditing ? UpdateSubjectSchema : CreateSubjectSchema),
    defaultValues: initialData
      ? {
          subjectCode: initialData.subjectCode,
          subjectName: initialData.subjectName,
          isActive: initialData.isActive,
        }
      : {
          subjectCode: "",
          subjectName: "",
        },
  });

  const onSubmit = (data: SubjectFormInput) => {
    if (isEditing) {
      updateSubject(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.SUBJECTS.LIST),
        }
      );
    } else {
      createSubject(data, {
        onSuccess: () => navigate(ROUTES.MASTER.SUBJECTS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Subject" : "Create Subject"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PHYSICS" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the subject (cannot be changed later).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Physics" {...field} />
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
                       Is this subject currently active?
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
                onClick={() => navigate(ROUTES.MASTER.SUBJECTS.LIST)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? "Update Subject" : "Create Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
