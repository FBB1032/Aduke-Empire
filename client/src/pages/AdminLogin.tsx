import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login", data);

      const auth = await apiRequest("GET", "/api/auth/check");
      if (auth?.authenticated) {
        toast({ title: "Welcome back!", description: "You have successfully logged in." });
        setLocation("/admin");
        return;
      }
      toast({ title: "Login failed", description: "Authentication failed. Please try again.", variant: "destructive" });
    } catch (error) {
      toast({ title: "Login failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-16 px-4 bg-[--color-bg]"
      data-testid="page-admin-login"
    >
      <Card className="card-lux w-full max-w-md">
        <CardHeader className="text-center space-y-6 pb-8 pt-10">
          <div className="mx-auto w-20 h-20 rounded-full bg-[rgba(212,175,55,0.08)] flex items-center justify-center mb-2 border border-[rgba(212,175,55,0.35)]">
            <Lock className="w-8 h-8 text-[--color-gold]" />
          </div>
          <div className="space-y-2">
            <CardTitle className="h2-script gold-text">Admin Login</CardTitle>
            <CardDescription className="subtitle">
              Enter your credentials to access the admin panel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-10 px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[--color-text]/80 ml-1">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[--color-muted]" />
                        <Input
                          type="email"
                          placeholder="admin@adukesempire.com"
                          className="pl-12 h-14 rounded-[var(--radius)] border-[rgba(212,175,55,0.35)] bg-[rgba(20,20,24,0.5)] text-base text-[--color-text] placeholder:text-[--color-muted] focus-visible:ring-0 focus-visible:border-[--color-gold]"
                          autoComplete="email"
                          data-testid="input-email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[--color-text]/80 ml-1">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[--color-muted]" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12 h-14 rounded-[var(--radius)] border-[rgba(212,175,55,0.35)] bg-[rgba(20,20,24,0.5)] text-base text-[--color-text] placeholder:text-[--color-muted] focus-visible:ring-0 focus-visible:border-[--color-gold]"
                          autoComplete="current-password"
                          data-testid="input-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-[--color-muted]" />
                          ) : (
                            <Eye className="w-5 h-5 text-[--color-muted]" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="btn-gold w-full h-14 text-lg rounded-full mt-4 font-medium tracking-wide"
                disabled={isLoading}
                data-testid="button-login"
              >
                <span className="shine" />
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black">
                    <div className="w-5 h-5 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
