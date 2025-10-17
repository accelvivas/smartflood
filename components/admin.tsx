import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getCurrentUser, getSensors, setSensors, upsertSensor, deleteSensor, getUsers, setUsers, type Role } from "./data";

export default function Admin() {
  const current = useMemo(() => getCurrentUser(), []);
  const isAdmin = current?.role === "admin";

  // Sensors state
  const [sensors, setSensorsState] = useState(getSensors());
  const [form, setForm] = useState({ name: "", lat: "", lng: "", status: "online", waterLevel: "0", riskLevel: "low" });

  // Users state
  const [users, setUsersState] = useState(getUsers());
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "resident" as Role });

  useEffect(() => {
    setSensorsState(getSensors());
    setUsersState(getUsers());
  }, []);

  function addOrUpdateSensor() {
    const payload = {
      name: form.name,
      lat: parseFloat(form.lat || "0"),
      lng: parseFloat(form.lng || "0"),
      status: form.status as any,
      waterLevel: parseFloat(form.waterLevel || "0"),
      riskLevel: form.riskLevel as any
    };
    const list = upsertSensor(payload);
    setSensorsState(list);
    setForm({ name: "", lat: "", lng: "", status: "online", waterLevel: "0", riskLevel: "low" });
  }

  function removeSensor(id: string) {
    const list = deleteSensor(id);
    setSensorsState(list);
  }

  function importIncidentsCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      // Very simple CSV parser: expects headers: date,location,waterLevel,notes
      const lines = text.split(/\r?\n/).filter(Boolean);
      const [header, ...rows] = lines;
      const key = 'sf_incidents';
      const existing: any[] = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
      for (const row of rows) {
        const [date, location, waterLevel, notes] = row.split(",");
        existing.push({ date, location, waterLevel: parseFloat(waterLevel || '0'), notes });
      }
      localStorage.setItem(key, JSON.stringify(existing));
      alert(`Imported ${rows.length} incident records`);
    };
    reader.readAsText(file);
  }

  function addUser() {
    const list = getUsers();
    if (list.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      alert('Email already exists');
      return;
    }
    list.push({ id: Math.random().toString(36).slice(2), ...newUser });
    setUsers(list);
    setUsersState(list);
    setNewUser({ name: "", email: "", password: "", role: "resident" });
  }

  function updateUserRole(id: string, role: Role) {
    const list = getUsers().map(u => u.id === id ? { ...u, role } : u);
    setUsers(list);
    setUsersState(list);
  }

  function removeUser(id: string) {
    const list = getUsers().filter(u => u.id !== id);
    setUsers(list);
    setUsersState(list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Admin / Data Management</h1>
        <p className="text-muted-foreground">Manage sensors, import incidents, and {isAdmin ? 'manage users' : 'view users'}</p>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="import">Import Incidents</TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin}>Users</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add / Edit Sensor</CardTitle>
              <CardDescription>Update sensor metadata</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Water Level (m)</Label>
                <Input value={form.waterLevel} onChange={e => setForm({ ...form, waterLevel: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Risk</Label>
                <Select value={form.riskLevel} onValueChange={(v) => setForm({ ...form, riskLevel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button onClick={addOrUpdateSensor}>Save Sensor</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Sensors</CardTitle>
              <CardDescription>Manage existing sensors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sensors.map(s => (
                <div key={s.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.status} • {s.waterLevel.toFixed(1)}m • {s.riskLevel.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setForm({ name: s.name, lat: String(s.lat), lng: String(s.lng), status: s.status, waterLevel: String(s.waterLevel), riskLevel: s.riskLevel })}>Edit</Button>
                    <Button variant="destructive" onClick={() => removeSensor(s.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Historical Flood Events</CardTitle>
              <CardDescription>Upload CSV with headers: date,location,waterLevel,notes</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="file" accept=".csv" onChange={e => {
                const f = e.target.files?.[0];
                if (f) importIncidentsCSV(f);
              }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>Add or change user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin && (
                <div className="grid md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <Input placeholder="Full name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                  <Input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  <Input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v as Role })}>
                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="lgu">LGU Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-4">
                    <Button onClick={addUser}>Add User</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email} • {u.role.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <Select value={u.role} onValueChange={(v) => updateUserRole(u.id, v as Role)}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resident">Resident</SelectItem>
                            <SelectItem value="lgu">LGU Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {isAdmin && (
                        <Button variant="destructive" onClick={() => removeUser(u.id)}>Remove</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
