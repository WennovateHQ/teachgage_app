import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call - replace with actual newsletter signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Successfully joined the waitlist!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to join waitlist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-teachgage-blue py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-4xl mx-auto px-6 gap-8">
        <div className="text-center lg:text-left">
          <p className="text-white text-2xl lg:text-4xl font-bold">
            Don't miss out. <br className="hidden lg:block" /> 
            Join our waitlist
          </p>
        </div>
        
        <div className="w-full lg:w-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input 
                type="email" 
                placeholder="smith@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-white w-full lg:w-80"
                disabled={isSubmitting}
              />
              <span className="absolute inset-y-0 left-3 flex items-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </span>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-lg py-2 px-4 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
