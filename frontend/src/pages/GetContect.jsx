import React, { useState , useNavigate } from 'react';
import Navbar from '../assets/commponents/Navbar'; // Adjust path as needed
import AboutUsSection from '../assets/commponents/AboutUsSection '; // Adjust path as needed
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import toast from "react-hot-toast";

const GetContect = () => {
 const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this with actual API
      const res = await axios.post("http://localhost:3000/contact", formData);
      console.log("Form submitted:", res.data);

      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setSubmitted(false), 3000); // Hide success message after 3s
    } catch (error) {
      console.error("Form submission error:", error.response?.data || error.message);
      toast.error("Failed to send message. Redirecting...");

      navigate("/error", {
        state: {
          message: error.response?.data?.error || "Something went wrong while sending your message.",
        },
      });
    }
  };

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>

        {/* Contact Form */}
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcce4b] focus:border-transparent"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcce4b] focus:border-transparent"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcce4b] focus:border-transparent"
                placeholder="Your Message"
              />
            </div>
            <button type="submit" className="w-full bg-[#fcce4b] text-[#04081a] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300">Send Message</button>
          </form>
          {submitted && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">Thank you! Your message has been sent successfully.</div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {['How can I track my order?', 'What is your return policy?', 'Do you offer international shipping?'].map((question, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3
                  className="text-lg font-medium text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleQuestion(index)}
                >
                  {question} {openQuestion === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </h3>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: openQuestion === index ? 'auto' : 0, opacity: openQuestion === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2"
                >
                  <p className="text-gray-600 p-3">
                    {index === 0 && 'You can track your order by logging into your account and visiting the "Order History" section.'}
                    {index === 1 && 'We offer a 30-day return policy for unused and unopened products. Please contact our support team for assistance.'}
                    {index === 2 && 'Yes, we ship internationally. Shipping costs and delivery times vary depending on the destination.'}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <AboutUsSection />
    </div>
  );
};

export default GetContect;