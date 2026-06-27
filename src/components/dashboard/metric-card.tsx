import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "secondary" | "accent";
}

const variantStyles = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

export function MetricCard({ title, value, icon: Icon, description, variant = "default" }: MetricCardProps) {
  return (
    <Card className={cn(variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <Icon className="h-4 w-4 opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-serif font-bold">{value}</div>
        {description && <p className="text-xs opacity-70 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
