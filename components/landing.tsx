import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Waves, Map, Brain, Bell, ShieldCheck } from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export default function Landing({ onGetStarted, onLogin, onSignup }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 relative z-10">
      <div className="decorative-bg" />
      <header className="w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 sticky top-0 z-20">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Smart Flood" className="w-10 h-10" />
            <div>
              <p className="text-lg font-semibold text-primary">Smart Flood Detection</p>
              <p className="text-xs text-muted-foreground">Philippine Monitoring System</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" onClick={onLogin}>Login</Button>
            <Button onClick={onSignup}>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12">
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="gradient-header">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white m-0">
                Real-time Flood Monitoring and Early Warning
              </h1>
              <p className="text-white/95 mt-2 m-0">
                Monitor rainfall, water levels, and flood risks. Get timely alerts for communities and decision makers.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={onGetStarted} className="px-6">Get Started</Button>
              <Button variant="outline" onClick={onLogin} className="px-6">Login</Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2"><Waves className="h-4 w-4 text-secondary" /> Sensors</div>
              <div className="flex items-center gap-2"><Map className="h-4 w-4 text-primary" /> Map</div>
              <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-accent" /> ML Predictions</div>
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-orange-500" /> Alerts</div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="chart-card">
              <div className="flex items-center gap-3 mb-1">
                <Map className="h-5 w-5 text-primary" />
                <p className="font-medium m-0">Live Flood Risk Map</p>
              </div>
              <p className="text-sm text-muted-foreground m-0">Interactive sensors with risk indicators and details.</p>
            </div>
            <div className="chart-card" style={{ borderLeftColor: 'var(--secondary)' }}>
              <div className="flex items-center gap-3 mb-1">
                <Brain className="h-5 w-5 text-secondary" />
                <p className="font-medium m-0">Prediction Console</p>
              </div>
              <p className="text-sm text-muted-foreground m-0">Model forecasts, confidence scores, and recent runs.</p>
            </div>
            <div className="chart-card" style={{ borderLeftColor: '#22c55e' }}>
              <div className="flex items-center gap-3 mb-1">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <p className="font-medium m-0">Role-based Access</p>
              </div>
              <p className="text-sm text-muted-foreground m-0">Admin, LGU staff, and resident views.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-12 bg-white/60 backdrop-blur-sm">
        <div className="container px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 Smart Flood Detection System</p>
          <p className="text-xs text-muted-foreground">National University - Lipa • Capstone Project</p>
        </div>
      </footer>
    </div>
  );
}
