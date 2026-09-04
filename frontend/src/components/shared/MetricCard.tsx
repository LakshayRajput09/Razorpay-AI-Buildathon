import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  iconColor?: string;
  badge?: React.ReactNode;
  sparkline?: number[];
  className?: string;
}

export function MetricCard({
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  iconColor = "text-[#B69A5A]",
  badge,
  sparkline,
  className,
}: MetricCardProps) {
  // Generate mini SVG sparkline path
  const sparklinePoints = React.useMemo(() => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    return sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [sparkline]);

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`${title}: ${value}`}
      className={cn(
        "bg-[#151514] border border-[rgba(242,238,229,0.10)] rounded-lg p-4 cursor-default group transition-all duration-200 hover:border-[rgba(242,238,229,0.20)] shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-[#A5A198]">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {Icon && (
            <div className="w-6 h-6 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.06)] flex items-center justify-center">
              <Icon className={cn("w-3.5 h-3.5 text-[#A5A198] group-hover:text-[#B69A5A] transition-colors", iconColor)} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-[26px] font-serif font-normal tracking-tight text-[#F2EEE5] tabular-nums">
          {value}
        </h3>

        {/* Mini sparkline */}
        {sparklinePoints && (
          <div className="w-20 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 80 24" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke={trend?.isPositive ? "#B69A5A" : "#706E68"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        )}
      </div>

      {(subValue || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "text-[11px] font-sans font-medium",
                trend.isPositive ? "text-[#66745D]" : "text-[#713B3B]"
              )}
            >
              {trend.value}
            </span>
          )}
          {trend && subValue && <span className="text-[#706E68] text-[10px]">•</span>}
          {subValue && (
            <span className="text-[#706E68] text-[11px] font-sans truncate" title={subValue}>
              {subValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
