import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl shadow-lg transform transition-all duration-150 active:scale-95 border-b-4 active:border-b-0 active:translate-y-1";
  
  const variants = {
    primary: "bg-brand-blue text-white border-blue-600 hover:bg-blue-400",
    secondary: "bg-brand-yellow text-gray-800 border-yellow-500 hover:bg-yellow-300",
    success: "bg-brand-green text-white border-green-600 hover:bg-green-400",
    danger: "bg-brand-red text-white border-red-600 hover:bg-red-400",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};