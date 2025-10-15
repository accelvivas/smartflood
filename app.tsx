import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { MapView } from "./components/MapView";
import { Alerts } from "./components/Alerts";
import { Predictions } from "./components/Predictions";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  LayoutDashboard, 
  Map, 
  Bell, 
  Brain,
  Droplets,
  Menu,
  X,
  Waves
} from "lucide-react";
import logo from "figma:asset/9e2da856a2b32954d18206ce28c10daf7879487d.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Smart Flood Logo" className="w-14 h-14 object-contain" />
            <div>
              <h2 className="text-xl text-primary">Smart Flood Detection</h2>
              <p className="text-xs text-muted-foreground">Philippine Monitoring System</p>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className={`gap-2 transition-all ${
                activeTab === "dashboard" 
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                  : "hover:bg-white/60"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "map" ? "default" : "ghost"}
              onClick={() => setActiveTab("map")}
              className={`gap-2 transition-all ${
                activeTab === "map" 
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                  : "hover:bg-white/60"
              }`}
            >
              <Map className="h-4 w-4" />
              Map View
            </Button>
            <Button
              variant={activeTab === "predictions" ? "default" : "ghost"}
              onClick={() => setActiveTab("predictions")}
              className={`gap-2 transition-all ${
                activeTab === "predictions" 
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                  : "hover:bg-white/60"
              }`}
            >
              <Brain className="h-4 w-4" />
              Predictions
            </Button>
            <Button
              variant={activeTab === "alerts" ? "default" : "ghost"}
              onClick={() => setActiveTab("alerts")}
              className={`gap-2 transition-all ${
                activeTab === "alerts" 
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                  : "hover:bg-white/60"
              }`}
            >
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "map" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("map");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <Map className="h-4 w-4" />
              Map View
            </Button>
            <Button
              variant={activeTab === "predictions" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("predictions");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <Brain className="h-4 w-4" />
              Predictions
            </Button>
            <Button
              variant={activeTab === "alerts" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("alerts");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 relative z-10">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "map" && <MapView />}
        {activeTab === "predictions" && <Predictions />}
        {activeTab === "alerts" && <Alerts />}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Smart Flood Logo" className="w-10 h-10 object-contain" />
              <div>
                <p className="text-sm">
                  © 2025 Smart Flood Detection System
                </p>
                <p className="text-xs text-muted-foreground">
                  National University - Lipa
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Capstone Project
              </p>
              <p className="text-xs text-muted-foreground">
                Alcantara • Hernandez • Tan • Viray
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
