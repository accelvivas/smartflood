import { useEffect, useMemo, useState } from "react";
import { Dashboard } from "./components/dashboard";
import { MapView } from "./components/mapview";
import { Alerts } from "./components/alerts";
import { Predictions } from "./components/predictions";
import Auth from "./components/auth";
import Landing from "./components/landing";
import Admin from "./components/admin";
import Reports from "./components/reports";
import { getCurrentUser, logout, seedIfEmpty } from "./components/data";
import type { Role } from "./components/data";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  LayoutDashboard, 
  Map, 
  Bell, 
  Brain,
  Shield,
  FileSpreadsheet,
  Droplets,
  Menu,
  X,
  Waves
} from "lucide-react";
const logo = "/logo.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    const u = getCurrentUser();
    if (u) { setUserRole(u.role); setUserName(u.name); }
  }, []);

  const isAuthed = useMemo(() => !!userRole, [userRole]);
  const canAdmin = useMemo(() => userRole === "admin" || userRole === "lgu", [userRole]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30">
      <div className="decorative-bg" />
      <div className="page-dim" />
      {!isAuthed ? (
        showLanding ? (
          <Landing 
            onGetStarted={() => setShowLanding(false)} 
            onLogin={() => setShowLanding(false)} 
            onSignup={() => setShowLanding(false)} 
          />
        ) : (
          <Auth onBack={() => setShowLanding(true)} onAuthenticated={() => {
            const u = getCurrentUser();
            if (u) { setUserRole(u.role); setUserName(u.name); }
          }} />
        )
      ) : (
      <>
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
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm">{userName}</p>
              <p className="text-xs text-muted-foreground uppercase">{userRole}</p>
            </div>
            <Button variant="outline" onClick={() => { logout(); setUserRole(null); setUserName(""); }}>Logout</Button>
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
            {canAdmin && (
              <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                onClick={() => setActiveTab("admin")}
                className={`gap-2 transition-all ${
                  activeTab === "admin" 
                    ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                    : "hover:bg-white/60"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              onClick={() => setActiveTab("reports")}
              className={`gap-2 transition-all ${
                activeTab === "reports" 
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-md" 
                  : "hover:bg-white/60"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Reports
            </Button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-2">
            <div className="flex items-center justify-between pb-2">
              <div>
                <p className="text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground uppercase">{userRole}</p>
              </div>
            </div>
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
            {canAdmin && (
              <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("admin");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("reports");
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Reports
            </Button>
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  logout();
                  setUserRole(null);
                  setUserName("");
                  setMobileMenuOpen(false);
                  setShowLanding(true);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 relative z-10">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "map" && <MapView />}
        {activeTab === "predictions" && <Predictions />}
        {activeTab === "alerts" && <Alerts />}
        {canAdmin && activeTab === "admin" && <Admin />}
        {activeTab === "reports" && <Reports />}
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
      </>) }
    </div>
  );
}
