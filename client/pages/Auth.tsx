import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Loader2, Facebook, Mail } from "lucide-react";

function validateEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const remember = Boolean(fd.get("remember"));
    if (!validateEmail(email)) return setLoginError("Enter a valid email.");
    if (password.length < 6) return setLoginError("Password must be at least 6 characters.");
    setLoginError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert(`Logged in as ${email}${remember ? " (remembered)" : ""}`);
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    if (!name.trim()) return setRegError("Enter your name.");
    if (!validateEmail(email)) return setRegError("Enter a valid email.");
    if (password.length < 6) return setRegError("Password must be at least 6 characters.");
    if (password !== confirm) return setRegError("Passwords do not match.");
    setRegError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    alert(`Registered ${email}`);
  };

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>
      <div className="container py-12">
        <div className="mx-auto w-full max-w-xl rounded-xl border border-border/60 bg-card/50 backdrop-blur p-6 md:p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center">Welcome to VeroVR</h1>
          <p className="text-center text-sm text-muted-foreground mt-1">Login or create an account to start converting videos</p>
          <Tabs defaultValue="login" className="mt-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form onSubmit={onLogin} className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <Input name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Password</p>
                  <Input name="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox name="remember" /> Remember me
                  </label>
                  <Link to="#" className="text-sm text-primary hover:underline">Forgot Password?</Link>
                </div>
                {loginError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm p-2">{loginError}</div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin"/>Signing in…</> : "Sign In"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" disabled={loading}><Mail className="mr-2 size-4"/> Google</Button>
                  <Button type="button" variant="outline" disabled={loading}><Facebook className="mr-2 size-4"/> Facebook</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <form onSubmit={onRegister} className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <Input name="name" placeholder="Jane Doe" required />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <Input name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <Input name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confirm Password</p>
                    <Input name="confirm" type="password" placeholder="••••••••" required />
                  </div>
                </div>
                {regError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm p-2">{regError}</div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin"/>Creating account…</> : "Create Account"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" disabled={loading}><Mail className="mr-2 size-4"/> Google</Button>
                  <Button type="button" variant="outline" disabled={loading}><Facebook className="mr-2 size-4"/> Facebook</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
