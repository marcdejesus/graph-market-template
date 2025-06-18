import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { InputProps } from '@/types'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    disabled = false,
    required = false,
    error,
    onChange,
    ...props
  }, ref) => {
    const baseStyles = 'block w-full rounded-lg border px-4 py-3 text-primary-900 placeholder-steel-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 disabled:bg-steel-50 disabled:text-steel-500 disabled:cursor-not-allowed'
    
    const variantStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-steel-300 focus:border-primary-500 focus:ring-primary-500'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={cn(baseStyles, variantStyles, className)}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${props.id}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input } 