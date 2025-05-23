import React from 'react';
import Footer from '../../components/Footer/Footer';

function Terms() {
  return (
    <>
      <div className="min-h-screen bg-[#F7F0EA] pt-24 pb-16 px-4"> {/* Adjusted pt-24 for navbar space */}
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Acceptance of Terms</h2>
              <p className="mb-4">By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Use License</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</li>
                <li>This is the grant of a license, not a transfer of title.</li>
                <li>This license shall automatically terminate if you violate any of these restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Disclaimer</h2>
              <p className="mb-4">The materials on Carats & Crowns's website are provided on an 'as is' basis. Carats & Crowns makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Limitations</h2>
              <p className="mb-4">In no event shall Carats & Crowns or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Carats & Crowns's website.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Governing Law</h2>
              <p className="mb-4">These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Terms;