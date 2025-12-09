import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconColor = "text-primary"
}: StatsCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm mt-2 font-medium",
                changeType === "positive" && "text-green-500",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-secondary", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
