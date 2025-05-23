import React from 'react';

const OurPromise = () => {
  const promises = [
    {
      image: '/images/buyback.png',
      title: 'Lifetime Buyback & Exchange',
      description: 'We offer lifetime buyback and exchange on all our products'
    },
    {
      image: '/images/diamond-certified.png',
      title: 'Certified Diamonds',
      description: 'All our diamonds are certified and of the highest quality'
    },
    {
      image: '/images/Hallmark.png',
      title: 'Hallmarked Gold',
      description: 'Every piece of gold jewelry is BIS hallmarked'
    },
    {
      image: '/images/free_delivery.png',
      title: 'Free Shipping',
      description: 'Free and insured shipping on all orders'
    }
  ];

  return (
    <section className="bg-[#F7F0EA] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#4D3C2A] mb-12">Our Promise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((promise, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-4 relative">
                <img
                  src={promise.image}
                  alt={promise.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#4D3C2A] mb-2">{promise.title}</h3>
              <p className="text-[#6B5744] text-sm">{promise.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPromise;