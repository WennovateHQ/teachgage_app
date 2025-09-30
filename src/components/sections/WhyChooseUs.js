import { useEffect, useState } from 'react'
import { Clock, MessageSquare, Target, TrendingUp } from 'lucide-react'

export default function WhyChooseUs() {
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

    const element = document.getElementById('why-choose-us')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: MessageSquare,
      title: "Anonymous Feedback",
      description: "Students share honest opinions without fear, giving you authentic insights to improve your teaching",
      bgColor: "bg-teachgage-medium-blue",
      delay: "delay-0"
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description: "Spend less time collecting feedback and more time teaching with our streamlined process",
      bgColor: "bg-teachgage-dark-blue",
      delay: "delay-150"
    },
    {
      icon: Target,
      title: "Tailored Questions",
      description: "Customized questions align with your course content, ensuring feedback is relevant and meaningful",
      bgColor: "bg-teachgage-medium-blue",
      delay: "delay-300"
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description: "Clear, data-driven reports highlight your strengths and areas for growth, empowering you to excel",
      bgColor: "bg-teachgage-dark-blue",
      delay: "delay-450"
    }
  ]

  return (
    <div id="why-choose-us" className="w-full px-4 lg:px-8 mx-auto text-gray-700 overflow-x-hidden">
      <div className="bg-teachgage-blue py-12 px-6 md:px-12 relative z-10">
        <div className={`max-w-xl mx-auto text-center mt-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="font-bold text-gray-400 my-3 text-2xl">Why Choose Us</h1>
          <p className="leading-relaxed text-white">Here's why instructors love us</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-10 md:gap-5 mt-20 mb-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className={`shadow-xl p-6 text-center rounded-xl ${feature.bgColor} transition-all duration-1000 ${feature.delay} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
                <h1 className="font-medium text-xl mb-3 lg:px-14 text-white lg:h-14 pt-3 flex items-center justify-center">
                  {feature.title}
                </h1>
                <p className="px-4 text-white">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
