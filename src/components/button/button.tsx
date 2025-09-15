import type { FC } from 'react'
import type { ButtonProps } from './types'

export const Button: FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  type = 'button',
  asChild = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg px-4 py-2 text-white transition-colors'

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-hover',
    accent: 'bg-accent hover:bg-accent-hover',
    secondary: 'border-border text-text-primary hover:bg-surface'
  }

  const variantStyle = variantStyles[variant] || variantStyles.primary

  const combinedClassName = `${baseClasses} ${variantStyle} ${className}`.trim()

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
