import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

function CookiePolicy() {
  return (
    <>
      <div className="min-h-screen bg-[#F7F0EA] pt-24 pb-16 px-4"> {/* Adjusted pt-24 for navbar space */}
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8">Cookie Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">What Are Cookies</h2>
              <p className="text-[#6B5744] mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing site usage, and assisting in our marketing efforts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">How We Use Cookies</h2>
              <p className="text-[#6B5744] mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 text-[#6B5744] space-y-2">
                <li>Essential cookies: Required for the website to function properly</li>
                <li>Functionality cookies: Remember your preferences and choices</li>
                <li>Analytics cookies: Help us understand how visitors use our website</li>
                <li>Marketing cookies: Track your activity to deliver personalized ads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Your Cookie Choices</h2>
              <p className="text-[#6B5744] mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Contact Us</h2>
              <p className="text-[#6B5744]">
                If you have any questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:support@jewelbox.co.in" className="text-[#4D3C2A] hover:underline">
                  support@jewelbox.co.in
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-[#4D3C2A] hover:text-[#6B5744] underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CookiePolicy;