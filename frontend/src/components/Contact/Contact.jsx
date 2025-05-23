import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="py-10 bg-[#F7F0EA]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-32">
          {/* Call Us Section */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#4D3C2A] flex items-center justify-center transition-all group-hover:scale-110">
              <FaPhone className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#4D3C2A] group-hover:text-[#6B5744]">CALL US</h3>
              <a href="tel:+91-91632-94444" className="text-[#6B5744] hover:text-[#4D3C2A] text-sm">
                +91- 91632 94444
              </a>
              <p className="text-xs text-[#6B5744]">Monday - Sunday: 11:00 - 19:00</p>
            </div>
          </div>

          {/* Mail Us Section */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#4D3C2A] flex items-center justify-center transition-all group-hover:scale-110">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#4D3C2A] group-hover:text-[#6B5744]">MAIL US</h3>
              <a 
                href="mailto:support@jewelbox.co.in" 
                className="text-[#6B5744] hover:text-[#4D3C2A] text-sm"
              >
                support@jewelbox.co.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;