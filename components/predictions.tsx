import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { RiskBadge } from "./riskbadge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Brain, 
  TrendingUp,
  Activity,
  Database,
  Calendar,
  Target
} from "lucide-react";
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

// Mock prediction accuracy data
const accuracyData = [
  { month: "Apr", accuracy: 82 },
  { month: "May", accuracy: 85 },
  { month: "Jun", accuracy: 88 },
  { month: "Jul", accuracy: 91 },
  { month: "Aug", accuracy: 89 },
  { month: "Sep", accuracy: 93 },
];

// Mock feature importance
const featureData = [
  { feature: "Rainfall (24h)", importance: 95 },
  { feature: "Water Level", importance: 88 },
  { feature: "Rainfall Rate", importance: 76 },
  { feature: "River Flow", importance: 68 },
  { feature: "Soil Moisture", importance: 54 },
  { feature: "Temperature", importance: 42 },
];

// Forecast predictions
const forecastData = [
  { time: "Now", risk: 65, actual: 62 },
  { time: "+3h", risk: 72, actual: null },
  { time: "+6h", risk: 78, actual: null },
  { time: "+12h", risk: 85, actual: null },
  { time: "+24h", risk: 68, actual: null },
  { time: "+48h", risk: 45, actual: null },
];

export function Predictions() {
  return (
    <div className="space-y-6">
      <div className="gradient-header">
        <h1 className="text-white m-0">ML Prediction Console</h1>
        <p className="text-white/90 m-0 mt-1">
          Machine learning model performance and flood forecasts
        </p>
      </div>

      {/* Model Performance Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Model Accuracy</CardTitle>
            <Target className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">93.2%</div>
            <Progress value={93.2} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Predictions Today</CardTitle>
            <Activity className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">248</div>
            <p className="text-xs text-muted-foreground mt-1">Running every 15 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Training Data</CardTitle>
            <Database className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15,432</div>
            <p className="text-xs text-muted-foreground mt-1">Historical records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Retrained</CardTitle>
            <Calendar className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3 days</div>
            <p className="text-xs text-muted-foreground mt-1">Next: in 4 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>48-Hour Flood Risk Forecast</CardTitle>
              <CardDescription>ML-based predictions for upcoming flood events</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    name="Actual Risk"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Risk"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Location-specific predictions */}
          <Card>
            <CardHeader>
              <CardTitle>Location-Specific Risk Analysis</CardTitle>
              <CardDescription>Current and predicted risk levels by area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { location: "Barangay San Jose", current: 87, forecast: 92, trend: "increasing" },
                { location: "Barangay Santa Cruz", current: 62, forecast: 58, trend: "decreasing" },
                { location: "Barangay Poblacion", current: 78, forecast: 82, trend: "increasing" },
                { location: "Barangay Riverside", current: 34, forecast: 28, trend: "decreasing" },
                { location: "Barangay Central", current: 55, forecast: 61, trend: "increasing" },
              ].map((item, index) => {
                const getRiskLevel = (value: number): "low" | "medium" | "high" => {
                  if (value >= 70) return "high";
                  if (value >= 40) return "medium";
                  return "low";
                };

                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="mb-2">{item.location}</h4>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current</p>
                          <RiskBadge level={getRiskLevel(item.current)} size="sm" />
                        </div>
                        <TrendingUp className={`h-4 w-4 ${
                          item.trend === "increasing" ? "text-red-500" : "text-green-500 rotate-180"
                        }`} />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">6h Forecast</p>
                          <RiskBadge level={getRiskLevel(item.forecast)} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p>{item.current}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Forecast</p>
                          <p className={item.trend === "increasing" ? "text-red-600" : "text-green-600"}>
                            {item.forecast}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Accuracy Over Time</CardTitle>
              <CardDescription>Historical prediction accuracy by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Accuracy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>Model prediction vs actual outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div></div>
                  <div className="text-xs text-muted-foreground p-2">Pred: No Flood</div>
                  <div className="text-xs text-muted-foreground p-2">Pred: Flood</div>
                  
                  <div className="text-xs text-muted-foreground p-2 text-left">Actual: No Flood</div>
                  <div className="bg-green-100 p-4 rounded border border-green-300">
                    <p>1,234</p>
                    <p className="text-xs text-muted-foreground">True Negative</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded border border-red-300">
                    <p>42</p>
                    <p className="text-xs text-muted-foreground">False Positive</p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground p-2 text-left">Actual: Flood</div>
                  <div className="bg-red-100 p-4 rounded border border-red-300">
                    <p>28</p>
                    <p className="text-xs text-muted-foreground">False Negative</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded border border-green-300">
                    <p>356</p>
                    <p className="text-xs text-muted-foreground">True Positive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed model evaluation scores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Precision</span>
                    <span>89.4%</span>
                  </div>
                  <Progress value={89.4} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Recall</span>
                    <span>92.7%</span>
                  </div>
                  <Progress value={92.7} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">F1-Score</span>
                    <span>91.0%</span>
                  </div>
                  <Progress value={91.0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">ROC-AUC</span>
                    <span>95.2%</span>
                  </div>
                  <Progress value={95.2} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Impact of each feature on flood predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={featureData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="feature" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="importance" name="Importance Score">
                    {featureData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.importance >= 70 ? "#2563eb" : entry.importance >= 50 ? "#60a5fa" : "#93c5fd"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
              <CardDescription>Current production model details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Algorithm</p>
                  <p>XGBoost Classifier</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Version</p>
                  <p>v2.4.1</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Training Date</p>
                  <p>October 12, 2025</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Training Samples</p>
                  <p>15,432 records</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Features</p>
                  <p>24 input variables</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Inference Time</p>
                  <p>~0.3 seconds</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-1">Model Description</h4>
                    <p className="text-sm text-muted-foreground">
                      The current production model uses gradient boosting to predict flood likelihood based on 
                      meteorological data, water level sensors, and historical flood patterns. It's retrained 
                      monthly with new data to maintain accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
