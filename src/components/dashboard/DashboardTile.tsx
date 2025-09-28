import { LucideIcon } from "lucide-react";

interface DashboardTileProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
}

const DashboardTile = ({ 
  title,
  description,
  icon: Icon,
  onClick,
  className,
  titleClassName = "",
  descriptionClassName = "",
  iconClassName = "",
 }: DashboardTileProps) => {
  return (
    <div
    className={`p-6 ${className}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
  >
    <div className="flex items-center gap-4 mb-4">
      <Icon className={`h-10 w-10 ${iconClassName}`} />
      <span className={`block ${titleClassName}`}>{title}</span>
    </div>
    <div className={descriptionClassName}>{description}</div>
  </div>
  );
};

export default DashboardTile;