import React, { useContext, useEffect } from 'react'
import HeroSection from '../assets/commponents/HeroSection'
import StatsCard from '../assets/commponents/Count'
import Navbar from '../assets/commponents/Navbar'
import FeaturesSection from '../assets/commponents/FeaturesSection'
import TestimonialsSection from '../assets/commponents/TestimonialsSection '
import CallToActionSection from '../assets/commponents/CallToActionSection '
import AboutUsSection from '../assets/commponents/AboutUsSection '
import ExploreSection from '../assets/commponents/ExploreSection'
import { useSocket } from "../context/Socket.context";
 
const home = () => {
   
  const { socket } = useSocket();
  
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <StatsCard/>
    <ExploreSection/>
    <FeaturesSection />  
    <TestimonialsSection />  
    <CallToActionSection />  
    <AboutUsSection/> 
    </>
  )
}

export default home