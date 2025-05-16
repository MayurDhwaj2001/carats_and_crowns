import React from 'react';
import { Link } from 'react-router-dom';

const BestSellers = () => {
  const products = [
    {
      name: 'Fiesty Diva Diamond Bracelet',
      price: '105,334',
      image: '/images/products/fiesty-diva-bracelet.jpg',
      link: '/products/fiesty-diva-bracelet'
    },
    {
      name: '50 Cent Firework Diamond Ring',
      price: '57,724',
      image: '/images/products/firework-ring.jpg',
      link: '/products/firework-ring'
    },
    {
      name: '50 Cent Timeless Solitaire Ring',
      price: '46,077',
      image: '/images/products/timeless-solitaire-ring.jpg',
      link: '/products/timeless-solitaire-ring'
    },
    {
      name: 'Treasured Beauty Diamond Bracelet',
      price: '58,470',
      image: '/images/products/treasured-beauty-bracelet.jpg',
      link: '/products/treasured-beauty-bracelet'
    },
    {
      name: 'Sun With Halo Diamond Pendant',
      price: '39,171',
      image: '/images/products/sun-halo-pendant.jpg',
      link: '/products/sun-halo-pendant'
    },
    {
      name: '2 Carat Classic Pear Studs',
      price: '132,109',
      image: '/images/products/classic-pear-studs.jpg',
      link: '/products/classic-pear-studs'
    },
    {
      name: 'Pure Elegance Diamond Hoops',
      price: '18,702',
      image: '/images/products/pure-elegance-hoops.jpg',
      link: '/products/pure-elegance-hoops'
    },
    {
      name: 'Glowing Galaxy Diamond Studs',
      price: '90,037',
      image: '/images/products/glowing-galaxy-studs.jpg',
      link: '/products/glowing-galaxy-studs'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Featured Image */}
          <div className="lg:w-1/3">
            <div className="relative h-[600px] overflow-hidden">
              <img
                src="/images/bestsellers/featured.jpg"
                alt="Bestsellers"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-white text-4xl font-bold mb-4">BESTSELLERS</h2>
                <Link
                  to="/products"
                  className="inline-block text-white text-lg hover:underline"
                >
                  See Products
                </Link>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.name}
                to={product.link}
                className="group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;