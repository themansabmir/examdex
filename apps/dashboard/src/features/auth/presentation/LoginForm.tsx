import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Label,
  Eye,
  EyeOff,
  Lock,
  Mail,
  zodResolver,
  useForm,
} from "@repo/ui";
import { LoginSchema, type LoginInput } from "../domain/Login";
import { useLogin } from "../application/useLogin";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#fafafa] dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.02),transparent)] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-zinc-200/60 dark:border-zinc-800/60 glass ring-1 ring-white/20 dark:ring-white/5">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center shadow-xl mb-4">
            <span className="text-white dark:text-zinc-950 font-black text-2xl">E</span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Admin Services</CardTitle>
          <p className="text-sm text-zinc-500 font-medium">
            Securely sign in to your ExamDex portal
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest font-bold text-zinc-400"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@examdex.com"
                  className="pl-11 h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-950/5 dark:focus:ring-white/5 transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] uppercase font-bold text-red-500 mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest font-bold text-zinc-400"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-tighter"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-11 pr-11 h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-950/5 dark:focus:ring-white/5 transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] uppercase font-bold text-red-500 mt-1.5 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98] mt-2 group"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Sign In System"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
