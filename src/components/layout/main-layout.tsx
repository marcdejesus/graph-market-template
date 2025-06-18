import { Header } from './header'
import { Footer } from './footer'
import { BaseComponentProps } from '@/types'

interface MainLayoutProps extends BaseComponentProps {
  /** Skip the header for special pages like auth pages */
  skipHeader?: boolean
  /** Skip the footer for special pages like checkout */  
  skipFooter?: boolean
  /** Add extra padding to main content */
  padded?: boolean
  /** Full width main content without max-width constraints */
  fullWidth?: boolean
  /** Custom background color class */
  backgroundColor?: string
}

export function MainLayout({ 
  children, 
  skipHeader = false,
  skipFooter = false,
  padded = false,
  fullWidth = false,
  backgroundColor = 'bg-white'
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${backgroundColor}`}>
      {!skipHeader && <Header />}
      
      <main className={`flex-1 ${padded ? 'py-8' : ''} ${fullWidth ? '' : 'mx-auto max-w-7xl w-full'}`}>
        <div className={padded && !fullWidth ? 'px-4 sm:px-6 lg:px-8' : ''}>
          {children}
        </div>
      </main>
      
      {!skipFooter && <Footer />}
    </div>
  )
} 