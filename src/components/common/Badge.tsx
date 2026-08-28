import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'stone' | 'purple' | 'neutral' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'slate', 
  size = 'sm',
  className = '',
  dot = false 
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    stone: 'bg-slate-100 text-slate-600 border-slate-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-white text-slate-700 border-slate-200 shadow-xs'
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    stone: 'bg-slate-400',
    slate: 'bg-slate-400',
    neutral: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-0.5 font-semibold'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide whitespace-nowrap ${variantStyles[variant] || variantStyles.slate} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.slate} animate-pulse`} />}
      {children}
    </span>
  );
};

export const getOrderStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Delivered':
      return 'emerald';
    case 'Shipped':
    case 'Out for Delivery':
    case 'Out for White-Glove Delivery':
      return 'blue';
    case 'Carpentry / Production':
    case 'In Production / Carpentry':
    case 'Packed & Ready':
    case 'Quality Check':
      return 'indigo';
    case 'Confirmed':
      return 'emerald';
    case 'Pending':
      return 'amber';
    case 'Cancelled':
    case 'Returned':
      return 'rose';
    default:
      return 'slate';
  }
};

export const getProductStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Active':
      return 'emerald';
    case 'Low Stock':
      return 'amber';
    case 'Out of Stock':
      return 'rose';
    case 'Draft':
      return 'purple';
    default:
      return 'slate';
  }
};

export const getInquiryStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Resolved':
      return 'emerald';
    case 'In Progress':
      return 'blue';
    case 'Awaiting Client':
      return 'purple';
    case 'New':
      return 'amber';
    default:
      return 'slate';
  }
};

export const getPriorityVariant = (priority: string): BadgeProps['variant'] => {
  switch (priority) {
    case 'Urgent':
      return 'rose';
    case 'High':
      return 'amber';
    case 'Medium':
      return 'blue';
    case 'Low':
      return 'slate';
    default:
      return 'slate';
  }
};

export const getPaymentStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Paid':
      return 'emerald';
    case 'Pending':
      return 'amber';
    case 'Refunded':
      return 'rose';
    case 'Partially Paid':
      return 'purple';
    default:
      return 'slate';
  }
};

