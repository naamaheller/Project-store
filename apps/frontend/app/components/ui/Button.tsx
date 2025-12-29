'use client';

import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

type ButtonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
    onClick?: () => void;
};

const baseStyles =
    'px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2';

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    outline:
        'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    danger: 'bg-red-60git 0 text-white hover:bg-red-700 focus:ring-red-400',
};

export function Button({
    children,
    variant = 'primary',
    disabled = false,
    onClick,
}: ButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            {children}
        </button>
    );
}