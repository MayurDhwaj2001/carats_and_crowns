import React from 'react';
import Footer from '../../components/Footer/Footer';

function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-[#F7F0EA] pt-24 pb-16 px-4"> {/* Adjusted pt-24 for navbar space */}
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information</li>
                <li>Billing and shipping address</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Process your orders and payments</li>
                <li>Communicate with you about orders and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Information Sharing</h2>
              <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Security</h2>
              <p className="mb-4">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Contact Us</h2>
              <p className="mb-4">If you have questions about our Privacy Policy, please contact us at:</p>
              <p>Email: support@jewelbox.co.in</p>
              <p>Phone: +91- 91632 94444</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;