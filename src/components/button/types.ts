export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: 'primary' | 'accent' | 'secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
}
