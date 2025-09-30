import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl px-8 mx-auto flex flex-col lg:flex-row items-start">
        <div className="flex flex-col w-full lg:w-6/12 justify-center lg:pt-24 items-start text-center lg:text-left mb-5 md:mb-0">
          <h1 
            className={`my-4 text-5xl font-bold leading-tight text-darken transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            Improve Your Teaching with Honest, Anonymous Feedback
          </h1>
          <p 
            className={`leading-normal text-2xl mb-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Easily collect tailored student feedback to grow as an educator
          </p>
          <div 
            className={`w-full md:flex items-center justify-center lg:justify-start md:space-x-5 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <Link href="/auth/signup">
              <button className="bg-teachgage-blue lg:mx-0 text-white text-xl font-bold rounded-full py-4 px-9 focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out">
                Get Started for free
              </button>
            </Link>
            <div className="flex items-center justify-center space-x-3 mt-5 md:mt-0 focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out">
              <Link href="#about">
                <button className="bg-white ml-10 w-full h-14 rounded-full border-2 border-teachgage-green py-4 px-9 flex items-center justify-center text-teachgage-green hover:bg-teachgage-green hover:text-white transition-colors duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-6/12 lg:mt-10 relative" id="hero-image">
          <div className="w-8/12 mx-auto 2xl:mb-20 rounded-2xl">
            <Image 
              src="/photography-coach-with-bg.jpg" 
              alt="Photography Coach"
              width={600}
              height={400}
              className={`w-full rounded-2xl transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              priority
            />
            <div 
              className={`absolute top-4 left-4 floating-4 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image 
                src="/header-instructor.svg"
                alt="Instructor Icon"
                width={64}
                height={64}
                className="bg-white bg-opacity-80 rounded-lg h-12 sm:h-16 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
