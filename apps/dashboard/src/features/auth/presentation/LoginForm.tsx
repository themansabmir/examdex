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
    <div className="flex items-center justify-center min-h-screen px-4 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
      <div className="radial-blur -top-[10%] -left-[10%]" />
      <div className="radial-blur -bottom-[10%] -right-[10%]" />

      <Card className="w-full max-w-md shadow-xl border-border/60 glass ring-1 ring-white/20 dark:ring-white/5">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          {/* Logo */}
          <div className="mx-auto h-12 w-12 rounded-2xl bg-foreground flex items-center justify-center shadow-xl mb-4">
            <span className="text-background font-black text-2xl">E</span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Admin Services</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">
            Securely sign in to your ExamDex portal
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@examdex.com"
                  className="input-base pl-11"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] uppercase font-bold text-destructive mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest font-bold text-muted-foreground"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-tighter transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-base pl-11 pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] uppercase font-bold text-destructive mt-1.5 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="btn-primary w-full text-sm uppercase tracking-widest mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="spinner border-primary-foreground/30 border-t-primary-foreground" />
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
