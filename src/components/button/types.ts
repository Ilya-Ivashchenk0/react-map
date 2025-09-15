export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: 'primary' | 'accent' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
}
