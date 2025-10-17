import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertItem, addAlert, getAlerts } from "./data";

export function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [templateLocation, setTemplateLocation] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [templateLevel, setTemplateLevel] = useState<"info" | "warning" | "critical">("warning");

  useEffect(() => { setAlerts(getAlerts()); }, []);

  function resend(a: AlertItem) {
    const item = addAlert({ location: a.location, message: a.message, level: a.level, time: new Date().toISOString() });
    setAlerts(prev => [item, ...prev]);
  }

  function schedule() {
    const at = new Date(Date.now() + 60*60000).toISOString();
    const item = addAlert({ location: templateLocation, message: templateMessage, level: templateLevel, time: at });
    setAlerts(prev => [item, ...prev]);
    setTemplateLocation(""); setTemplateMessage("");
  }

  return (
    <div className="space-y-6">
      <div className="gradient-header">
        <h1 className="text-white m-0">Alerts & Notifications</h1>
        <p className="text-white/90 m-0">Create templates, resend, and schedule alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Template</CardTitle>
          <CardDescription>Compose an alert to send now or schedule</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2">
            <Input placeholder="Location (e.g., Barangay San Jose)" value={templateLocation} onChange={e => setTemplateLocation(e.target.value)} />
            <Textarea placeholder="Message" value={templateMessage} onChange={e => setTemplateMessage(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Select value={templateLevel} onValueChange={(v: string) => setTemplateLevel(v as any)}>
              <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full md:w-auto" onClick={() => {
              const item = addAlert({ location: templateLocation, message: templateMessage, level: templateLevel });
              setAlerts(prev => [item, ...prev]);
              setTemplateLocation(""); setTemplateMessage("");
            }}>Send Now</Button>
            <Button variant="secondary" className="w-full md:w-auto" onClick={schedule}>Schedule +1h</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Alerts</CardTitle>
          <CardDescription>History of sent and scheduled alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{a.location}</p>
                <p className="text-sm text-muted-foreground">{a.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.time).toLocaleString()} • {a.level.toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="md:w-auto" onClick={() => resend(a)}>Resend</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
