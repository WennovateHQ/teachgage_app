import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import AboutUs from '../components/sections/AboutUs'
import HowItWorks from '../components/sections/HowItWorks'
import Testimonials from '../components/sections/Testimonials'
import FAQ from '../components/sections/FAQ'
import Newsletter from '../components/sections/Newsletter'
import Footer from '../components/layout/Footer'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      <Head>
        <title>TeachGage - Improve Your Teaching with Honest, Anonymous Feedback</title>
        <meta name="description" content="Easily collect tailored student feedback to grow as an educator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/teachgage-icon.ico" />
      </Head>

      <div className="antialiased">
        <Navbar />
        <Hero />
        <HowItWorks />
        <AboutUs />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <Footer />
      </div>
    </>
  )
}
