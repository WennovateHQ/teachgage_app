import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full text-gray-700 bg-white">
      <div className="flex flex-col max-w-screen-xl px-8 mx-auto md:items-center md:justify-between md:flex-row">
        <div className="flex flex-row items-center justify-between py-6">
          <div className="relative md:mt-8">
            <Link href="/" className="text-lg relative z-50 font-bold tracking-widest text-gray-900 rounded-lg focus:outline-none focus:shadow-outline">
              <Image 
                src="/teachgage-blue-logo.png" 
                alt="TeachGage Logo" 
                width={90} 
                height={60}
                className="w-[90px] h-[60px]"
                priority
              />
            </Link>
          </div>
          <button 
            className="rounded-lg md:hidden focus:outline-none focus:shadow-outline" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        <nav className={`${
          isOpen 
            ? 'h-auto transform scale-y-100' 
            : 'h-0 md:h-auto transform scale-y-0 md:scale-y-100'
        } flex flex-col flex-grow md:items-center pb-4 md:pb-0 md:flex md:justify-end md:flex-row origin-top duration-300 overflow-hidden md:overflow-visible`}>
          <Link href="#about" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-8 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline">
            About Us
          </Link>
          <Link href="#why-choose-us" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-8 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline">
            Why Choose Us
          </Link>
          <Link href="#blog" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-8 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline">
            Blog
          </Link>
          <Link href="#contact" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-8 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline">
            Contact
          </Link>
          <Link href="/auth/signin" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-8 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline">
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-10 py-3 mt-2 text-sm text-center bg-white text-gray-800 rounded-full md:mt-8 md:ml-4 border border-gray-300 hover:bg-gray-50 transition-colors">
            Sign Up
          </Link>
          <div className="relative mt-2 md:mt-8 md:ml-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-3 text-sm rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full md:w-48 border border-gray-300"
            />
            <Search className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </nav>
      </div>
    </div>
  )
}
