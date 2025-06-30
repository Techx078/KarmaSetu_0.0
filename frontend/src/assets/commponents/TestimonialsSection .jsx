import React from 'react';  

const TestimonialsSection = () => {  
    const testimonials = [  
        {   
            name: "Mukesh Kumar",   
            text: "This service is fantastic! Highly recommend it.",   
            image: "https://i.pinimg.com/474x/44/e5/ae/44e5ae278ffccc21ce8de4d1e00aeef3.jpg"   
        },  
        {   
            name: "Adhik Sharma",   
            text: "I found a great provider quickly and easily.",   
            image: "https://i.pinimg.com/474x/91/80/09/918009d84079781d208835a188245173.jpg"   
        },  
        {   
            name: "Jatin Mishra",   
            text: "Reliable and trustworthy service! Will use again.",   
            image: "https://i.pinimg.com/474x/38/54/a8/3854a8e825bc816e7d7c2caa2c255460.jpg"   
        },  
    ];  

    return (  
        <div className="py-10 bg-white">  
            <h2 className="text-center text-4xl font-bold mb-8 text-gray-800">What Our Users Say</h2>  
            <div className="flex flex-wrap justify-center space-x-4">  
                {testimonials.map((testimonial, index) => (  
                    <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg w-80 transition-transform duration-300 transform hover:scale-105 ease-in-out m-2">  
                        <img src={testimonial.image} alt={testimonial.name} className="rounded-full object-cover mx-auto mb-4 w-24 h-24 border-2 border-[#fcce4b]" />  
                        <p className="text-gray-700 italic text-center">"{testimonial.text}"</p>  
                        <p className="mt-2 font-semibold text-center text-gray-800">{testimonial.name}</p>  
                    </div>  
                ))}  
            </div>  
        </div>  
    );  
};  

export default TestimonialsSection;