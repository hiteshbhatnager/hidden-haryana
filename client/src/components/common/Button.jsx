import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-forest-800 hover:bg-forest-900 text-white shadow-sm hover:shadow-md focus:ring-forest-700 active:scale-[0.99]',
    secondary:
      'bg-forest-100 hover:bg-forest-200 text-forest-900 focus:ring-forest-600',
    accent:
      'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-sm hover:shadow-md focus:ring-terracotta-500',
    outline:
      'border border-stone-300 hover:border-forest-700 hover:bg-forest-50/50 text-stone-800 focus:ring-forest-600',
    ghost:
      'text-stone-700 hover:bg-stone-200/60 focus:ring-stone-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

