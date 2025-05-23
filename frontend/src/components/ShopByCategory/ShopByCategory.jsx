import React from 'react';
import { Link } from 'react-router-dom';

const ShopByCategory = () => {
  const categories = [
    {
      name: 'Rings',
      image: '/images/categories/rings.jpg',
      link: '/products?category=ring',
      featured: true
    },
    {
      name: 'Bracelets',
      image: '/images/categories/bracelets.jpg',
      link: '/products?category=bracelet'
    },
    {
      name: 'Earrings',
      image: '/images/categories/earrings.jpg',
      link: '/products?category=earrings'
    },
    {
      name: 'Pendants',
      image: '/images/categories/pendants.jpg',
      link: '/products?category=pendant'
    }
  ];

  const featuredCategory = categories.find(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-1">
          {/* Featured Category (Rings) */}
          <div className="lg:w-[55%]">
            <Link
              to={featuredCategory.link}
              className="block relative h-[calc(100vh/3*3+8px)] overflow-hidden group"
            >
              <img
                src={featuredCategory.image}
                alt={featuredCategory.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <h3 className="text-white text-2xl">{featuredCategory.name}</h3>
              </div>
            </Link>
          </div>

          {/* Regular Categories Stack */}
          <div className="lg:w-[45%] flex flex-col gap-1">
            {regularCategories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="block relative h-[calc(100vh/3)] overflow-hidden group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <h3 className="text-white text-2xl">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;