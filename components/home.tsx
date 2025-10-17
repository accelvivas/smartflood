import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RiskBadge } from "./riskbadge";
import { getAlerts, getSensors } from "./data";
import { MapPin, Bell, AlertTriangle } from "lucide-react";

export default function Home() {
  const sensors = getSensors();
  const alerts = getAlerts().slice(0, 5);

  const topRisk = sensors
    .slice()
    .sort((a, b) => (a.riskLevel === "high" ? -1 : a.riskLevel === "medium" && b.riskLevel === "low" ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="gradient-header">
        <h1 className="text-white m-0">Local Risk View</h1>
        <p className="text-white/90 m-0">Current risk level for your area and recent alerts</p>
      </div>

      <Card className="border-l-4 border-l-primary shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Monitored Locations
          </CardTitle>
          <CardDescription>Nearby sensors and their current risk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topRisk.map(s => (
            <div key={s.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted-foreground">Water Level: {s.waterLevel.toFixed(1)} m • Status: {s.status}</p>
              </div>
              <RiskBadge level={s.riskLevel} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-secondary shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-secondary" /> Recent Alerts</CardTitle>
          <CardDescription>Latest notifications affecting your vicinity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{a.location}</p>
                <p className="text-sm text-muted-foreground">{a.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.time).toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Evacuation Suggestions (Residents) */}
      <Card className="border-l-4 border-l-green-500 shadow-md">
        <CardHeader>
          <CardTitle>Evacuation Suggestions</CardTitle>
          <CardDescription>Nearby evacuation centers and suggested options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "San Jose Gymnasium", address: "Brgy San Jose, Lipa", capacity: 300, distanceKm: 1.2 },
            { name: "Central Elementary School", address: "Brgy Poblacion, Lipa", capacity: 450, distanceKm: 2.9 },
            { name: "Riverside Covered Court", address: "Brgy Riverside, Lipa", capacity: 220, distanceKm: 3.5 },
          ].map((c, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.address}</p>
                </div>
                <p className="text-sm text-muted-foreground">{c.distanceKm} km</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Approx. capacity: {c.capacity} people</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Note: Sample data. Provide official center list to replace these placeholders.</p>
        </CardContent>
      </Card>
    </div>
  );
}
