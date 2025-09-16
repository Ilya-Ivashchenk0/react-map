import type { FC } from 'react'
import { memo } from 'react'
import type { ButtonProps } from './types'

// Базовый компонент кнопки с различными вариантами стилизации
export const Button: FC<ButtonProps> = memo(
  ({
    className = '',
    variant = 'primary',
    type = 'button',
    asChild = false,
    ...props
  }) => {
    const baseClasses = 'rounded-lg px-3 py-1 text-white transition-colors'

    const variantStyles = {
      primary: 'bg-primary hover:bg-primary-hover',
      accent: 'bg-accent hover:bg-accent-hover',
      secondary:
        'bg-gray-600 hover:bg-gray-700 text-white border border-gray-500',
      danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-500'
    }

    const variantStyle = variantStyles[variant] || variantStyles.primary
    const combinedClassName =
      `${baseClasses} ${variantStyle} ${className}`.trim()

    return (
      <button
        type={type as 'button' | 'submit' | 'reset' | undefined}
        className={combinedClassName}
        {...props}
      >
        {props.children}
      </button>
    )
  }
)

Button.displayName = 'Button'
