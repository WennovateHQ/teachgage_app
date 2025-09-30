import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('faq')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      id: 1,
      question: "Is feedback anonymous?",
      answer: "Yes, student identities are fully protected. Our platform ensures complete anonymity so students can provide honest feedback without fear of repercussions."
    },
    {
      id: 2,
      question: "How long does setup take?",
      answer: "Setup takes just 5 minutes! You can create your account, add courses, and start collecting feedback in no time."
    },
    {
      id: 3,
      question: "Can I customize questions?",
      answer: "Absolutely! You can create custom questions tailored to your specific courses and teaching style, or choose from our pre-built templates."
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All data is encrypted and stored securely, and we comply with educational privacy standards to protect both instructor and student information."
    }
  ]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div id="faq" className="w-full px-4 lg:px-8 mx-auto text-gray-700 overflow-x-hidden mt-16 mb-10 pb-6">
      <div className={`text-center max-w-screen-md mx-auto transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <p className="text-gray-500">FAQ</p>
        <h1 className="text-3xl font-bold mb-4">Answers to FAQs</h1>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id}
            className={`bg-white rounded-lg shadow-md p-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <button 
              className="w-full text-left text-xl font-medium text-gray-900 mb-2 flex justify-between items-center group"
              onClick={() => toggleFAQ(faq.id)}
            >
              {faq.question}
              <span className={`transition-transform duration-200 ${
                openFAQ === faq.id ? 'rotate-180' : ''
              }`}>
                <ChevronDown className="w-5 h-5 text-teachgage-green" />
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${
              openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <p className="text-gray-600 pt-2">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
