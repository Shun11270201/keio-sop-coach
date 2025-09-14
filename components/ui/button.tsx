import * as React from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow',
      outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    } as const
    const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-10 px-6', lg: 'h-11 px-8 text-base' } as const
    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
