import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { getAlerts, getSensors } from "./data";

function toCSV(rows: any[], headers?: string[]): string {
  if (!rows.length) return "";
  const cols = headers || Object.keys(rows[0]);
  const esc = (v: any) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [cols.join(",")];
  for (const row of rows) {
    lines.push(cols.map(c => esc((row as any)[c])).join(","));
  }
  return lines.join("\n");
}

function download(filename: string, content: string, type = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const sensors = useMemo(() => getSensors(), []);
  const alerts = useMemo(() => getAlerts(), []);
  const predictions = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("sf_predictions") || "[]"); } catch { return []; }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>Reports & Exports</h1>
        <p className="text-muted-foreground">Export CSV (Excel-compatible) for events, predictions, and sensor logs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alerts / Events</CardTitle>
          <CardDescription>Download all alerts as CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {
            const rows = alerts.map(a => ({ id: a.id, location: a.location, message: a.message, level: a.level, time: new Date(a.time).toISOString() }));
            const csv = toCSV(rows, ["id","location","message","level","time"]);
            download(`alerts_${new Date().toISOString().slice(0,10)}.csv`, csv);
          }}>Download Alerts CSV</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictions</CardTitle>
          <CardDescription>Download prediction logs as CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {
            const rows = predictions.map((p: any) => ({ id: p.id, location: p.location, risk: p.risk, createdAt: p.createdAt }));
            const csv = toCSV(rows, ["id","location","risk","createdAt"]);
            download(`predictions_${new Date().toISOString().slice(0,10)}.csv`, csv);
          }}>Download Predictions CSV</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensor Logs</CardTitle>
          <CardDescription>Export current sensor snapshot as CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {
            const rows = sensors.map(s => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng, status: s.status, waterLevel: s.waterLevel, riskLevel: s.riskLevel }));
            const csv = toCSV(rows, ["id","name","lat","lng","status","waterLevel","riskLevel"]);
            download(`sensors_${new Date().toISOString().slice(0,10)}.csv`, csv);
          }}>Download Sensors CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}
