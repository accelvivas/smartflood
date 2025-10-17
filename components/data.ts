export type Role = "admin" | "lgu" | "resident";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface Sensor {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "offline";
  waterLevel: number;
  riskLevel: "low" | "medium" | "high";
}

export interface AlertItem {
  id: string;
  location: string;
  message: string;
  level: "info" | "warning" | "critical";
  time: string;
  scheduledAt?: string | null;
}

export interface PredictionLog {
  id: string;
  location: string;
  risk: number;
  createdAt: string;
}

const LS = {
  users: "sf_users",
  current: "sf_current_user",
  sensors: "sf_sensors",
  alerts: "sf_alerts",
  predictions: "sf_predictions",
  incidents: "sf_incidents"
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function seedIfEmpty() {
  if (!localStorage.getItem(LS.users)) {
    const admin: User = { id: uid("u"), name: "Administrator", email: "admin@smartflood.local", role: "admin", password: "admin" };
    const staff: User = { id: uid("u"), name: "LGU Staff", email: "lgu@smartflood.local", role: "lgu", password: "lgu" };
    const resident: User = { id: uid("u"), name: "Resident", email: "resident@smartflood.local", role: "resident", password: "resident" };
    localStorage.setItem(LS.users, JSON.stringify([admin, staff, resident]));
  }
  if (!localStorage.getItem(LS.sensors)) {
    const sensors: Sensor[] = [
      { id: uid("s"), name: "Brgy San Jose Gauge", lat: 13.9411, lng: 121.1634, status: "online", waterLevel: 2.6, riskLevel: "high" },
      { id: uid("s"), name: "Brgy Poblacion Gauge", lat: 13.9445, lng: 121.1601, status: "online", waterLevel: 1.8, riskLevel: "medium" },
      { id: uid("s"), name: "Riverside Gauge", lat: 13.9382, lng: 121.1702, status: "offline", waterLevel: 0.0, riskLevel: "low" }
    ];
    localStorage.setItem(LS.sensors, JSON.stringify(sensors));
  }
  if (!localStorage.getItem(LS.alerts)) {
    const now = new Date();
    const alerts: AlertItem[] = [
      { id: uid("a"), location: "Barangay San Jose", message: "High flood risk detected. Expected water level: 3.2m", level: "warning", time: new Date(now.getTime() - 10*60000).toISOString() },
      { id: uid("a"), location: "Barangay Poblacion", message: "Heavy rainfall forecast for next 6 hours", level: "info", time: new Date(now.getTime() - 25*60000).toISOString() }
    ];
    localStorage.setItem(LS.alerts, JSON.stringify(alerts));
  }
  if (!localStorage.getItem(LS.predictions)) {
    const preds: PredictionLog[] = [
      { id: uid("p"), location: "Barangay San Jose", risk: 87, createdAt: new Date().toISOString() },
      { id: uid("p"), location: "Barangay Poblacion", risk: 78, createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(LS.predictions, JSON.stringify(preds));
  }
}

export function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(LS.users) || "[]"); } catch { return []; }
}
export function setUsers(users: User[]) {
  localStorage.setItem(LS.users, JSON.stringify(users));
}
export function getCurrentUser(): User | null {
  try { return JSON.parse(localStorage.getItem(LS.current) || "null"); } catch { return null; }
}
export function setCurrentUser(user: User | null) {
  if (user) localStorage.setItem(LS.current, JSON.stringify(user));
  else localStorage.removeItem(LS.current);
}

export function getSensors(): Sensor[] {
  try { return JSON.parse(localStorage.getItem(LS.sensors) || "[]"); } catch { return []; }
}
export function setSensors(sensors: Sensor[]) {
  localStorage.setItem(LS.sensors, JSON.stringify(sensors));
}

export function getAlerts(): AlertItem[] {
  try { return JSON.parse(localStorage.getItem(LS.alerts) || "[]"); } catch { return []; }
}
export function setAlerts(alerts: AlertItem[]) {
  localStorage.setItem(LS.alerts, JSON.stringify(alerts));
}

export function addAlert(alert: Omit<AlertItem, "id" | "time"> & { time?: string }) {
  const list = getAlerts();
  const item: AlertItem = { id: uid("a"), time: alert.time || new Date().toISOString(), ...alert } as AlertItem;
  list.unshift(item);
  setAlerts(list);
  return item;
}

export function upsertSensor(sensor: Partial<Sensor> & { id?: string }) {
  const list = getSensors();
  if (sensor.id) {
    const idx = list.findIndex(s => s.id === sensor.id);
    if (idx >= 0) list[idx] = { ...(list[idx]), ...(sensor as any) };
  } else {
    list.push({
      id: uid("s"),
      name: sensor.name || "New Sensor",
      lat: sensor.lat ?? 0,
      lng: sensor.lng ?? 0,
      status: (sensor.status as any) || "offline",
      waterLevel: sensor.waterLevel ?? 0,
      riskLevel: (sensor.riskLevel as any) || "low"
    });
  }
  setSensors(list);
  return list;
}

export function deleteSensor(id: string) {
  const list = getSensors().filter(s => s.id !== id);
  setSensors(list);
  return list;
}

export function signup(user: { name: string; email: string; password: string; role: Role }): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: "Email already registered" };
  }
  const newUser: User = { id: uid("u"), ...user };
  users.push(newUser);
  setUsers(users);
  setCurrentUser(newUser);
  return { ok: true, user: newUser };
}

export function login(email: string, password: string): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!found) return { ok: false, error: "Invalid credentials" };
  setCurrentUser(found);
  return { ok: true, user: found };
}

export function logout() {
  setCurrentUser(null);
}
