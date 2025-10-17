import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addAlert } from "./data";

const LS_SETTINGS = "sf_settings";

interface SettingsData {
  riskThreshold: number; // percent
  phone?: string;
  email?: string;
  offlineCache?: boolean;
}

export default function Settings() {
  const [riskThreshold, setRiskThreshold] = useState<number>(70);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [offlineCache, setOfflineCache] = useState<boolean>(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SETTINGS);
      if (raw) {
        const s: SettingsData = JSON.parse(raw);
        if (typeof s.riskThreshold === "number") setRiskThreshold(s.riskThreshold);
        if (typeof s.phone === "string") setPhone(s.phone);
        if (typeof s.email === "string") setEmail(s.email);
        if (typeof s.offlineCache === "boolean") setOfflineCache(s.offlineCache);
      }
    } catch {}
  }, []);

  function save() {
    const s: SettingsData = { riskThreshold, phone, email, offlineCache };
    localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
  }

  function testNotification() {
    // Simulate sending a test alert; it will appear in Alerts
    addAlert({
      location: "Test Notification",
      message: `Test alert to ${phone || email || "your account"}`,
      level: "info",
    });
  }

  return (
    <div className="space-y-6">
      <div className="gradient-header">
        <h1 className="text-white m-0">Settings</h1>
        <p className="text-white/90 m-0">Configure alert thresholds and contact info</p>
      </div>

      <Card className="border-l-4 border-l-secondary shadow-md">
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>When to notify you based on predicted risk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="riskThreshold">Flood Risk Threshold (%)</Label>
            <Input
              id="riskThreshold"
              type="number"
              min={0}
              max={100}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">You will be notified when predicted risk is at or above this percentage.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary shadow-md">
        <CardHeader>
          <CardTitle>Contact & Notifications</CardTitle>
          <CardDescription>SMS fallback and email for alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (SMS)</Label>
            <Input id="phone" placeholder="09XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="offlineCache" type="checkbox" checked={offlineCache} onChange={(e) => setOfflineCache(e.target.checked)} />
            <Label htmlFor="offlineCache">Enable offline caching (recent predictions & messages)</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save Settings</Button>
            <Button variant="secondary" onClick={testNotification}>Send Test Notification</Button>
          </div>
          <p className="text-xs text-muted-foreground">Note: Push notifications require browser/device permission. SMS is simulated.</p>
        </CardContent>
      </Card>
    </div>
  );
}
