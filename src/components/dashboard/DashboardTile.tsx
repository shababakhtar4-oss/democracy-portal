import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardTileProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

const DashboardTile = ({ title, description, icon: Icon, onClick, className }: DashboardTileProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 bg-gradient-card border-0 shadow-card group",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-gradient-primary rounded-full group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-civic-primary group-hover:text-civic-primary-light transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTile;