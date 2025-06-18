import { Header } from './header'
import { Footer } from './footer'
import { BaseComponentProps } from '@/types'

export function MainLayout({ children }: BaseComponentProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
} 