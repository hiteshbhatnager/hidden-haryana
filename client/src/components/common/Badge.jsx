import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200/80',
    forest: 'bg-forest-100/90 text-forest-900 border border-forest-200',
    terracotta: 'bg-terracotta-100 text-terracotta-900 border border-terracotta-200',
    amber: 'bg-amber-100 text-amber-900 border border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    gem: 'bg-gradient-to-r from-amber-500/15 to-rose-500/15 text-stone-900 border border-amber-300 font-semibold',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

