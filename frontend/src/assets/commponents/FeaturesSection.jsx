import React from 'react';  
import * as FaIcons from "react-icons/fa";  

const FeaturesSection = () => {  
    const features = [  
        { title: "Fast Service", description: "Connect with service providers in minutes.", icon: "FaRocket" },  
        { title: "Verified Providers", description: "All providers are vetted and verified.", icon: "FaShieldAlt" },  
        { title: "Affordable Pricing", description: "Get competitive quotes for services.", icon: "FaDollarSign" },  
        { title: "Customer Support", description: "24/7 customer support to assist you.", icon: "FaHeadset" },  
    ];  

    return (  
        <div className="py-10 bg-gray-50">  
            <h2 className="text-center text-4xl font-bold mb-8">Our Features</h2>  
            <div className="flex flex-wrap justify-center space-x-4">  
                {features.map((feature, index) => {  
                    const IconComponent = FaIcons[feature.icon];  
                    return (  
                        <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 transform hover:scale-105 ease-in-out m-2 w-72 flex flex-col items-center">  
                            {IconComponent && <IconComponent size={50} className="mb-4 text-[#fcce4b]" />}  
                            <h3 className="text-xl font-semibold">{feature.title}</h3>  
                            <p className="mt-2 text-gray-600 text-center">{feature.description}</p>  
                        </div>  
                    );  
                })}  
            </div>  
        </div>  
    );  
};  

export default FeaturesSection;