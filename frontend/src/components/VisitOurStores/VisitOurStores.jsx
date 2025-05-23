import React, { useState } from 'react';

const VisitOurStores = () => {
  const [selectedCity, setSelectedCity] = useState('Kolkata');

  const cities = ['Kolkata', 'Delhi', 'Chennai', 'Gurgaon', 'Guwahati', 'Bangalore'];

  const stores = {
    Kolkata: [
      {
        name: 'Camac Street, Arinights House',
        address: '6 Camac Street, Arinights House, 1st Floor, Kolkata, West Bengal',
        pincode: '700017',
        phone: '40993 00493',
        hours: '11:00 A.M. TO 7:00 P.M.'
      },
      {
        name: 'Camac Street, Shantiniketan Building',
        address: '8 Camac Street, Shantiniketan Building, Ground Floor, Kolkata',
        pincode: '700017',
        phone: '40993 00492',
        hours: '11:00 A.M. TO 8:00 P.M.'
      },
      {
        name: 'City Center I Mall, Salt Lake',
        address: 'City Centre I Mall, D - 1St, Salt Lake, Kolkata, West Bengal',
        pincode: '700064',
        phone: '40993 00494',
        hours: '11:00 A.M. TO 7:00 P.M.'
      }
    ],
    // Add other cities' stores here
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#4D3C2A] mb-8">VISIT OUR STORES</h2>
        
        {/* City Selection */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-md ${selectedCity === city
                ? 'bg-[#4D3C2A] text-white'
                : 'bg-[#F7F0EA] text-[#4D3C2A] hover:bg-[#E5D5C5]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores[selectedCity]?.map((store, index) => (
            <div key={index} className="bg-[#F7F0EA] rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-[#4D3C2A] mb-3">{store.name}</h3>
              <p className="text-[#6B5744] mb-2">{store.address}</p>
              <p className="text-[#6B5744] mb-2">Pin Code: {store.pincode}</p>
              <p className="text-[#6B5744] mb-2">Phone: {store.phone}</p>
              <p className="text-[#6B5744] mb-4">STORE HOURS: {store.hours}</p>
              
              <div className="flex gap-3">
                <a
                  href={`tel:${store.phone}`}
                  className="flex-1 text-center bg-[#4D3C2A] text-white py-2 rounded-md hover:bg-[#3A2E20]">
                  Call us
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#4D3C2A] text-white py-2 rounded-md hover:bg-[#3A2E20]">
                  See directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisitOurStores;