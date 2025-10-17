import { MetricCard } from "./metriccard";
import { RiskBadge } from "./riskbadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  Cloud, 
  Droplets, 
  Waves, 
  AlertTriangle,
  TrendingUp,
  Radio,
  Bell,
  Brain
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";

// Mock data for rainfall
const rainfallData = [
  { time: "00:00", rainfall: 2.4, forecast: 3.1 },
  { time: "03:00", rainfall: 3.2, forecast: 4.2 },
  { time: "06:00", rainfall: 5.1, forecast: 6.5 },
  { time: "09:00", rainfall: 8.3, forecast: 9.2 },
  { time: "12:00", rainfall: 12.5, forecast: 14.8 },
  { time: "15:00", rainfall: 15.2, forecast: 18.5 },
  { time: "18:00", rainfall: 11.8, forecast: 13.2 },
  { time: "21:00", rainfall: 7.6, forecast: 8.4 },
];

// Mock data for water levels
const waterLevelData = [
  { time: "00:00", level: 1.2, threshold: 2.5 },
  { time: "03:00", level: 1.4, threshold: 2.5 },
  { time: "06:00", level: 1.8, threshold: 2.5 },
  { time: "09:00", level: 2.1, threshold: 2.5 },
  { time: "12:00", level: 2.6, threshold: 2.5 },
  { time: "15:00", level: 2.9, threshold: 2.5 },
  { time: "18:00", level: 2.4, threshold: 2.5 },
  { time: "21:00", level: 2.0, threshold: 2.5 },
];

// Mock data for flood predictions
const predictionData = [
  { location: "Barangay San Jose", risk: "high", probability: 87 },
  { location: "Barangay Santa Cruz", risk: "medium", probability: 62 },
  { location: "Barangay Poblacion", risk: "high", probability: 78 },
  { location: "Barangay Riverside", risk: "low", probability: 34 },
  { location: "Barangay Central", risk: "medium", probability: 55 },
];

const recentAlerts = [
  { 
    id: 1, 
    type: "warning",
    location: "Barangay San Jose", 
    message: "High flood risk detected. Expected water level: 3.2m", 
    time: "10 minutes ago" 
  },
  { 
    id: 2, 
    type: "info",
    location: "Barangay Poblacion", 
    message: "Heavy rainfall forecast for next 6 hours", 
    time: "25 minutes ago" 
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Waves className="h-8 w-8" />
          <h1 className="text-white">Smart Flood Detection Dashboard</h1>
        </div>
        <p className="text-white/90">
          Real-time monitoring and prediction for flood-prone areas in the Philippines
        </p>
      </div>

      {/* Recent Alerts */}
      {recentAlerts.map((alert) => (
        <Alert 
          key={alert.id} 
          className={`${
            alert.type === "warning" 
              ? "border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent shadow-md" 
              : "border-l-4 border-l-secondary bg-gradient-to-r from-cyan-50 to-transparent shadow-md"
          }`}
        >
          <AlertTriangle className={`h-4 w-4 ${alert.type === "warning" ? "text-yellow-600" : "text-secondary"}`} />
          <AlertTitle>{alert.location}</AlertTitle>
          <AlertDescription>
            {alert.message} • {alert.time}
          </AlertDescription>
        </Alert>
      ))}

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Current Rainfall"
          value="15.2 mm/hr"
          change="+23% from last hour"
          changeType="negative"
          icon={Cloud}
          iconColor="text-secondary"
        />
        <MetricCard
          title="Average Water Level"
          value="2.3 meters"
          change="Above normal threshold"
          changeType="negative"
          icon={Waves}
          iconColor="text-primary"
        />
        <MetricCard
          title="Active Sensors"
          value="12 / 15"
          change="3 sensors offline"
          changeType="neutral"
          icon={Radio}
          iconColor="text-accent"
        />
        <MetricCard
          title="High Risk Areas"
          value="3 locations"
          change="2 new alerts today"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rainfall Chart */}
        <Card className="border-l-4 border-l-secondary shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-secondary" />
              Rainfall Monitoring (24h)
            </CardTitle>
            <CardDescription>Actual vs Forecasted Rainfall</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'mm/hr', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#00bcd4" 
                  strokeWidth={3}
                  name="Actual"
                  dot={{ fill: '#00bcd4', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#8bc34a" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecast"
                  dot={{ fill: '#8bc34a', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Water Level Chart */}
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-primary" />
              Water Level Monitoring (24h)
            </CardTitle>
            <CardDescription>River gauge readings and thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={waterLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'meters', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#1e4a7a" 
                  fill="#00bcd4"
                  fillOpacity={0.3}
                  name="Water Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="threshold" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Threshold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card className="border-l-4 border-l-accent shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Flood Risk Predictions by Location
          </CardTitle>
          <CardDescription>ML-based flood likelihood predictions for monitored areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictionData.map((prediction, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="mb-1">{prediction.location}</h4>
                  <div className="flex items-center gap-4">
                    <RiskBadge level={prediction.risk as "low" | "medium" | "high"} />
                    <span className="text-sm text-muted-foreground">
                      {prediction.probability}% probability
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        prediction.risk === "high" 
                          ? "bg-red-500" 
                          : prediction.risk === "medium" 
                          ? "bg-yellow-500" 
                          : "bg-green-500"
                      }`}
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>
                  <Bell className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
