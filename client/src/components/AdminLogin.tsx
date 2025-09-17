import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Shield, XCircle } from "lucide-react";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function AdminLogin({
  onLogin,
  isLoading,
  error,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login attempt:", email);
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-gradient-to-br from-card via-card to-card/95">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            data-testid="text-login-title"
          >
            Admin Portal
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Access the IC Registration Admin Dashboard
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {error && (
            <div
              className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-800 dark:from-red-950 dark:to-rose-950 p-6 mb-6 shadow-lg"
              data-testid="alert-login-error"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-rose-100/20 dark:from-red-900/20 dark:to-rose-900/20"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 text-lg focus-visible:ring-primary"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 text-lg focus-visible:ring-primary"
                  required
                  data-testid="input-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mt-8"
              disabled={isLoading || !email || !password}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  Access Admin Portal
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Protected by Supabase Authentication</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
