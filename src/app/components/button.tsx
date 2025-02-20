import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function Button({ children, onClick, className = "", disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white rounded ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
