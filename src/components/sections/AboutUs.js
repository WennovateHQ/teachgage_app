import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AboutUs() {
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

    const element = document.getElementById('about')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div id="about" className="w-full px-4 lg:px-8 mx-auto text-gray-700 overflow-x-hidden">
      <div className="mt-24 flex flex-col md:flex-row items-start md:space-x-10">
        <div className={`md:w-6/12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}>
          <Image 
            src="/medium-shot-smiley-woman-playing-guitar.jpg"
            alt="Music instructor teaching guitar"
            width={600}
            height={400}
            className="md:w-8/12 mx-auto rounded-2xl"
            priority={false}
          />
        </div>
        <div className={`md:w-6/12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
        }`}>
          <div className="flex items-center space-x-20 mb-5">
            <h1 className="text-gray-400 tracking-widest text-sm">About Us</h1>
          </div>
          <h1 className="font-semibold text-darken text-2xl lg:pr-40">
            Elevating Coaching and Teaching Standards
          </h1>
          <p className="text-gray-500 my-5 lg:pr-20">
            Empower educators and coaches to achieve continuous professional growth and excellence, 
            transforming the learning experience and setting new standards for impactful practice.
          </p>
          <button className="bg-teachgage-green w-60 px-5 py-3 border text-white font-medium my-4 focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out rounded-xl">
            Learn More
          </button>
        </div>
      </div>

      {/* Trusted By Early Adopters */}
      <div className="mt-24 flex flex-col md:flex-row items-start md:space-x-10">
        <div className={`md:w-6/12 px-12 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}>
          <h1 className="font-bold text-darken text-4xl lg:pr-40">Trusted by early Adopters</h1>
          <p className="text-gray-500 my-5 lg:pr-20">
            Educators from our beta phase are already seeing the value of anonymous feedback
          </p>
        </div>
        <div className={`md:w-6/12 px-12 text-center transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
        }`}>
          <h1 className="font-bold text-darken text-4xl lg:pr-40">Designed for you</h1>
          <p className="text-gray-500 my-5 lg:pr-20">
            Create custom forms in under 5 minutes, tailored to your <br /> courses
          </p>
        </div>
      </div>
    </div>
  )
}
