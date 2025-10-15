import { Badge } from "./ui/badge";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RiskBadgeProps {
  level: "low" | "medium" | "high";
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const config = {
    low: {
      color: "bg-accent/20 text-accent border-accent/30",
      icon: CheckCircle,
      label: "Low Risk"
    },
    medium: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: AlertCircle,
      label: "Medium Risk"
    },
    high: {
      color: "bg-destructive/20 text-destructive border-destructive/30",
      icon: AlertTriangle,
      label: "High Risk"
    }
  };

  const { color, icon: Icon, label } = config[level];
  const iconSize = size === "lg" ? 20 : size === "md" ? 16 : 14;

  return (
    <Badge variant="outline" className={`${color} gap-1.5 ${size === "lg" ? "px-4 py-2" : ""}`}>
      <Icon size={iconSize} />
      {label}
    </Badge>
  );
}
