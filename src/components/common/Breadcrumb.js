import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  // Always include Dashboard as the first item if not already present
  const breadcrumbItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    ...items
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-teachgage-navy mb-6">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const Icon = item.icon

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            
            {isLast ? (
              <span className="text-teachgage-blue font-medium flex items-center">
                {Icon && <Icon className="w-4 h-4 mr-1" />}
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-teachgage-blue flex items-center transition-colors">
                {Icon && <Icon className="w-4 h-4 mr-1" />}
                {item.name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
