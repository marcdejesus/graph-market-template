import Link from 'next/link'

const footerNavigation = {
  shop: [
    { name: 'Shop All', href: '/products' },
    { name: 'Tops', href: '/categories/tops' },
    { name: 'Bottoms', href: '/categories/bottoms' },
    { name: 'Outerwear', href: '/categories/outerwear' },
    { name: 'Accessories', href: '/categories/accessories' },
  ],
  account: [
    { name: 'Sign In', href: '/auth/login' },
    { name: 'Create Account', href: '/auth/register' },
    { name: 'Order History', href: '/orders' },
    { name: 'Profile', href: '/profile' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]
}

const socialLinks = [
  { name: 'Instagram', href: '#', icon: InstagramIcon },
  { name: 'Twitter', href: '#', icon: TwitterIcon },
  { name: 'Facebook', href: '#', icon: FacebookIcon },
  { name: 'YouTube', href: '#', icon: YouTubeIcon },
]

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-steel-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bebas font-bold">
              Stay in the Loop
            </h3>
            <p className="mt-2 text-steel-300">
              Get the latest gear drops, exclusive offers, and fitness tips.
            </p>
            <div className="mt-6 flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l-lg border-0 bg-white px-4 py-3 text-primary-900 placeholder-steel-400 focus:outline-none focus:ring-2 focus:ring-performance-500"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-performance-500 px-6 py-3 font-medium text-white hover:bg-performance-600 focus:outline-none focus:ring-2 focus:ring-performance-500 focus:ring-offset-2 focus:ring-offset-primary-900 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="text-3xl font-bebas font-bold">FitMarket</span>
            </div>
            <p className="text-steel-300 text-sm leading-relaxed">
              Premium athletic wear for the modern athlete. Engineered for performance, 
              designed for style.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-steel-400 hover:text-performance-500 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href as any}
                    className="text-steel-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-3">
              {footerNavigation.account.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href as any}
                    className="text-steel-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href as any}
                    className="text-steel-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href as any}
                    className="text-steel-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-steel-700">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-steel-400 text-sm">
              © 2024 FitMarket. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href={"/privacy" as any} className="text-steel-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href={"/terms" as any} className="text-steel-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href={"/accessibility" as any} className="text-steel-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Social Media Icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.648.001 12.017.001zm5.557 9.188c.023.194.023.388.023.582 0 5.938-4.52 12.784-12.784 12.784-2.54 0-4.901-.743-6.882-2.016.36.042.705.063 1.084.063 2.1 0 4.03-.713 5.571-1.916-1.96-.037-3.615-1.331-4.184-3.109.275.042.551.063.85.063.413 0 .826-.056 1.21-.16-2.048-.412-3.59-2.22-3.59-4.39v-.058c.594.33 1.291.532 2.025.555-1.203-.802-1.994-2.178-1.994-3.735 0-.823.22-1.594.605-2.257 2.208 2.712 5.509 4.49 9.23 4.68-.076-.33-.115-.682-.115-1.04 0-2.514 2.04-4.553 4.553-4.553 1.31 0 2.494.554 3.326 1.443.826-.16 1.594-.458 2.297-.876-.275.86-.86 1.573-1.613 2.025.733-.083 1.443-.275 2.098-.555-.496.733-1.127 1.378-1.852 1.893z"/>
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
} 