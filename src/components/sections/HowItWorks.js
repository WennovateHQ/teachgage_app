import { useEffect, useState } from 'react'
import { UserPlus, MessageCircle, QrCode, BarChart3 } from 'lucide-react'

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('how-it-works')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your free account in seconds using a simple form or single sign-on (Google or institutional email). No credit card required.",
      bgColor: "bg-teachgage-medium-blue",
      delay: "delay-0"
    },
    {
      icon: MessageCircle,
      title: "Add Courses and Questions",
      description: "Easily add your courses and customize feedback questions to match your teaching style. Choose from templates or create your own.",
      bgColor: "bg-teachgage-dark-blue",
      delay: "delay-150"
    },
    {
      icon: QrCode,
      title: "Collect Feedback",
      description: "Share anonymous feedback forms via a link, QR code, or email. Students respond quickly on any device, ensuring high participation",
      bgColor: "bg-teachgage-medium-blue",
      delay: "delay-300"
    },
    {
      icon: BarChart3,
      title: "Analyze & Improve",
      description: "Get real-time, actionable insights through clear reports and visualizations. Identify strengths and track progress to enhance your teaching",
      bgColor: "bg-teachgage-dark-blue",
      delay: "delay-450"
    }
  ]

  return (
    <div id="how-it-works" className="w-full px-4 lg:px-8 mx-auto text-gray-700 overflow-x-hidden">
      <div className="bg-teachgage-blue py-12 px-6 md:px-12">
        <div className={`max-w-xl mx-auto text-center mt-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="font-bold text-gray-400 my-3 text-2xl">How it Works</h1>
          <p className="leading-relaxed text-white">
            Get started in four simple steps to collect anonymous student feedback and improve your teaching
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-10 md:gap-5 mt-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div 
                key={index}
                className={`shadow-xl p-6 text-center rounded-xl ${step.bgColor} transition-all duration-1000 ${step.delay} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
                <h1 className="font-medium text-xl mb-3 lg:px-14 text-white">
                  {step.title}
                </h1>
                <p className="px-4 text-white">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
        
        {/* Watch Demo Button */}
        <div className={`max-w-xl mx-auto text-center mt-16 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <button className="px-6 py-3 bg-white text-teachgage-blue font-semibold rounded-2xl shadow-lg hover:bg-gray-100 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  )
}
