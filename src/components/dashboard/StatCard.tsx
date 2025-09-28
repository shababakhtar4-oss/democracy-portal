import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  progress: number;
  progressColor: string;
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  progress, 
  progressColor,
  className = "" 
}: StatCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          
          <div className="space-y-2">
            {/* <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div> */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: progressColor 
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;