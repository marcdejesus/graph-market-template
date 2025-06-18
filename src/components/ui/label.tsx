import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, required = false, error = false, ...props }, ref) => {
    const baseStyles = 'block text-sm font-medium leading-6'
    
    const textColor = error 
      ? 'text-red-700' 
      : 'text-primary-900'

    return (
      <label
        ref={ref}
        className={cn(baseStyles, textColor, className)}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label } 