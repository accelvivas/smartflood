import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-secondary"
}: MetricCardProps) {
  const changeColors = {
    positive: "text-accent",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="border-t-4 border-t-transparent hover:border-t-secondary transition-all shadow-md hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-muted rounded-lg">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{value}</div>
        {change && (
          <p className={`text-xs ${changeColors[changeType]} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
