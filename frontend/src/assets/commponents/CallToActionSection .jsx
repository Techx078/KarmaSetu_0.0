import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className="bg-[#fcce4b] p-12 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-white">Join thousands of satisfied customers today!</p>
            <button 
                onClick={handleSignUpClick}
                className="mt-6 bg-white text-[#fcce4b] px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105"
            >
                Sign Up Now
            </button>
        </div>
    );
};

export default CallToActionSection;