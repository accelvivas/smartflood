import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { LeafletMap } from "./leafletmap";
import { Sensor, getSensors } from "./data";
import { Radio, Waves, AlertTriangle, MapPin } from "lucide-react";

export function MapView() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selected, setSelected] = useState<Sensor | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSensors(getSensors());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sensors;
    return sensors.filter(s => s.name.toLowerCase().includes(q));
  }, [sensors, query]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-8 w-8" />
          <h1 className="text-white">Flood Risk Map</h1>
        </div>
        <p className="text-white/90">Interactive map showing sensor locations and risk zones</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-secondary" />
              Sensor Network Map
            </CardTitle>
            <CardDescription>Tap markers for details</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 500 }}>
              <LeafletMap sensors={sensors} onSensorSelect={setSelected} selectedSensor={selected} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Sensor Details
            </CardTitle>
            <CardDescription id="sensorDetailsDesc">{selected ? selected.name : "Tap a sensor to view details"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!selected ? (
              <div className="text-center text-muted-foreground py-12">
                <MapPin className="h-12 w-12 mx-auto opacity-50 mb-4" />
                <p>Select a sensor on the map to view detailed information</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={selected.status === "online" ? "default" : "secondary"}>
                    {selected.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Water Level</span>
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-primary" />
                    <span>{selected.waterLevel.toFixed(1)} m</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Risk</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${selected.riskLevel === 'high' ? 'text-red-600' : selected.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    <span className="uppercase font-medium">{selected.riskLevel}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            All Sensors
          </CardTitle>
          <CardDescription>Overview of all monitored sensors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Search sensors..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="grid gap-3">
            {filtered.map(s => (
              <div key={s.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.status} • {s.waterLevel.toFixed(1)}m • {s.riskLevel.toUpperCase()}</p>
                </div>
                <Button size="sm" onClick={() => setSelected(s)}>View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
