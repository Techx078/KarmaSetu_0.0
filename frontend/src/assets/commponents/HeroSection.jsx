import React, { useEffect, useState, useRef } from 'react';
import * as FaIcons from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const heroContent = [
    {
        title: "FIND SKILLED",
        subtitle: "SERVICE PROVIDERS",
        description: "Near you in minutes by searching",
        imageUrl: "https://www.shutterstock.com/image-photo/construction-worker-wearing-yellow-hard-600nw-2492762443.jpg",
    },
    {
        title: "HASSLE-FREE",
        subtitle: "SERVICE REQUESTS",
        description: "Real-time notifications & bookings",
        imageUrl: "https://images.unsplash.com/photo-1489514354504-1653aa90e34e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "TRANSPARENT",
        subtitle: "PRICING & TIMING",
        description: "Pay based on work duration",
        imageUrl: "https://wallpapercave.com/wp/wp6718873.jpg",
    },
    {
        title: "NATIONWIDE",
        subtitle: "SERVICE NETWORK",
        description: "Connecting professionals across India",
        imageUrl: "https://wallpapers.com/images/hd/car-mechanic-maintenance-032p8vmzjfg1fq9t.jpg",
    },
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const heroTextRef = useRef(null);
    const heroImageRef = useRef(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                let res = await axios.get("http://localhost:3000/service/get-services");
                let result = res.data.result.map(service => ({
                    ...service,
                    icon: FaIcons[service.icon] || FaIcons.FaTools
                }));
                setServices(result);
            } catch (err) {
                const errorMsg = err.response?.data?.message || "Failed to fetch services!";
                navigate("/error", { state: { message: errorMsg } });
            }
        }
        fetchServices();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Animate out
            gsap.to(heroTextRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.4,
                ease: "power2.in",
            });
            gsap.to(heroImageRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Update index
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
                },
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Animate in
        gsap.fromTo(
            heroTextRef.current,
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
        );
        gsap.fromTo(
            heroImageRef.current,
            { opacity: 0,x:100, scale: 0.9 },
            { opacity: 1,x:0, scale: 1, duration: 0.8, ease: "power2.out" }
        );
    }, [currentIndex]);

   

    return (
        <div className="relative bg-transparent overflow-hidden">
            <div className="relative h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] w-full">
                <div className="relative z-20 flex flex-col items-center justify-center p-6 lg:p-16 h-full md:items-start">
                    <img
                        ref={heroImageRef}
                        className="w-[100vw] h-[100vh] absolute inset-0 z-10 lg:object-fill object-cover bg-center backdrop-blur-sm bg-black/60"
                        src={heroContent[currentIndex].imageUrl}
                        alt=""
                    />
                    <div
                        ref={heroTextRef}
                        className="absolute z-30 flex flex-col justify-center max-w-2xl text-center md:text-left"
                    >
                        <h1 className="text-3xl lg:text-7xl font-bold text-[#0a0419] mb-4 leading-tight">
                            {heroContent[currentIndex].title}
                            <br />
                            {heroContent[currentIndex].subtitle}
                        </h1>
                        <p className="text-base lg:text-2xl text-white mb-6">
                            {heroContent[currentIndex].description}
                        </p>
                        <div>
                            <button className="bg-[#fcce4b] text-[#04081a] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300">
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 relative z-20 overflow-hidden mt-0">
                <div className="flex space-x-4 overflow-x-auto py-12 px-6 snap-x snap-mandatory">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className="service-card bg-white shadow-lg rounded-lg flex-shrink-0 w-56 p-6 flex flex-col items-center snap-center hover:shadow-xl transition-shadow duration-300"
                            onClick={() => navigate(`/homeSevice/${item._id}`)}
                        >
                            {item.icon && <item.icon size={48} className="text-[#fcce4b] mb-4" />}
                            <p className="text-center font-semibold text-gray-800">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
