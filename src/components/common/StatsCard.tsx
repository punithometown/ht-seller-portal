import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  badgeText?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  iconBgColor = 'bg-slate-100',
  iconColor = 'text-slate-700',
  badgeText,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border border-[#E7DDD3] shadow-[0_1px_3px_rgba(36,21,14,0.04)] transition-all duration-150 ${onClick ? 'cursor-pointer hover:border-[#D5C5B5] hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-[#24150E] tracking-tight">{value}</h3>
            {badgeText && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3ECE2] text-[#6B5546] border border-[#E0D2C3]">
                {badgeText}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgColor} ${iconColor} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-[#F3ECE2] flex items-center justify-between text-xs">
          {change && (
            <span className={`inline-flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-[#9C8270] font-medium truncate text-right text-[11px]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
