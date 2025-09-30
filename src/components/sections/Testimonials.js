import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Testimonials() {
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

    const element = document.getElementById('testimonials')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      id: 1,
      name: "Liam Williams",
      role: "Plumbing Instructor",
      image: "/plumber-instructor.jpg",
      quote: "TeachGage helped get valuable feedback which helped me improved the way I teach."
    },
    {
      id: 2,
      name: "Denzel Smith", 
      role: "Music Instructor",
      image: "/music-instructor.jpg",
      quote: "Setting up feedback forms is so easy!"
    },
    {
      id: 3,
      name: "Olivia Smith",
      role: "K-12 Educator", 
      image: "/k-12-teacher.jpg",
      quote: "This platform helped me understand my students' needs!"
    }
  ]

  return (
    <div id="testimonials" className="w-full px-4 lg:px-8 mx-auto text-gray-700 overflow-x-hidden mt-28">
      <div className={`text-center max-w-screen-md mx-auto transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <p className="text-gray-500">Testimonial</p>
        <h1 className="text-3xl font-bold mb-4">Instructors' Testimonial</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 px-6 md:px-12">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id}
            className={`bg-white rounded-lg shadow-md p-6 text-center floating transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
              <Image 
                src={testimonial.image}
                alt={testimonial.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                priority={false}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{testimonial.role}</p>
            <p className="text-gray-600">{testimonial.quote}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
