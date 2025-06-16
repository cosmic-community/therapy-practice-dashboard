import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral'
}: StatsCardProps) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <p className={cn(
              "text-xs",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-red-600",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {change} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}