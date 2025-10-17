import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { login, signup, seedIfEmpty, Role } from "./data";
import { ArrowLeft } from "lucide-react";

interface AuthProps {
  onAuthenticated: () => void;
  onBack?: () => void;
}

export default function Auth({ onAuthenticated, onBack }: AuthProps) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [error, setError] = useState("");

  useEffect(() => { seedIfEmpty(); }, []);

  return (
    <div className="container max-w-md mx-auto py-16">
      {onBack && (
        <div className="mb-4">
          <Button variant="ghost" className="gap-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Smart Flood</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button className="w-full" onClick={() => {
                const res = login(email, password);
                if (!res.ok) { setError(res.error || ""); return; }
                onAuthenticated();
              }}>Login</Button>
              <p className="text-xs text-muted-foreground">Demo accounts: admin@smartflood.local / admin • lgu@smartflood.local / lgu • resident@smartflood.local / resident</p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Juan Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Password</Label>
                <Input id="password2" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v: string) => setRole(v as Role)}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="lgu">LGU Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button className="w-full" onClick={() => {
                const res = signup({ name, email, password, role });
                if (!res.ok) { setError(res.error || ""); return; }
                onAuthenticated();
              }}>Create account</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
