import React, { useEffect, useState } from 'react';

// TypingEffect Component with Continuous Loop
const TypingEffect = ({ text }) => {  
  const [displayText, setDisplayText] = useState('');  

  useEffect(() => {  
    let index = 0;  
    let isMounted = true;

    const typeAndReset = () => {
      if (!isMounted) return;

      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
        setTimeout(typeAndReset, 100); // Typing speed (50ms per character)
      } else {
        // When text is fully typed, wait 1 second, then reset and start again
        setTimeout(() => {
          if (isMounted) {
            setDisplayText('');
            index = 0;
            setTimeout(typeAndReset, 500); // Short pause before restarting
          }
        }, 1000); // Pause after full text (1s)
      }
    };

    typeAndReset(); // Start the typing loop

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [text]);  

  return <span>{displayText}</span>;  
};

const AboutUsSection = () => {  
  const textContent = "AAt our core, we are dedicated to connecting you with highly skilled service providers in your area. Our mission is to make services accessible and affordable for everyone. We strive to revolutionize the way you find and interact with service providers, offering a seamless experience tailored to your needs.";

  return (  
    <footer id="about-us" className="py-10 mb-0 bg-gradient-to-r from-[#070a13] to-[#0a0600]">  
      <div className="max-w-7xl mx-auto px-4">  
        <h2 className="text-center text-5xl font-bold text-gray-400 mb-6">About Us</h2>  
        
        <p className="max-w-2xl mx-auto text-center text-lg text-gray-500 mb-4 px-4">  
          <TypingEffect text={textContent} />  
        </p>  
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">  
          <span className="bg-white text-[#fcce4b] px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">  
            Discover More  
          </span>  
          <span className="border-2 border-gray-400 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300">  
            Our Values  
          </span>  
        </div>  
      </div>  
    </footer>  
  );  
};  

export default AboutUsSection;