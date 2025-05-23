import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Abhi Nandal',
      date: '1 May 2023',
      rating: 5,
      comment: 'Purchased a ring from jewelbox, the product was awesome, have an amazing experience, customer service is top notch, have to...',
      avatar: '/images/Testimonials/profile.png'
    },
    {
      name: 'Simran Shah',
      date: '1 May 2023',
      rating: 5,
      comment: 'Friendly staff behaviour. & All type of stock available in store.',
      avatar: '/images/Testimonials/profile.png'
    },
    {
      name: 'Sumit Bhattacharyya',
      date: '1 May 2023',
      rating: 5,
      comment: 'Great collection and excellent customer service',
      avatar: '/images/Testimonials/profile.png'
    },
    {
      name: 'Pradip Kumar Sharma',
      date: '1 May 2023',
      rating: 5,
      comment: 'Staff behaviour is fantastic.They are talented vendor excellent wish them a good luck',
      avatar: '/images/Testimonials/profile.png'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStarSolid}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#4D3C2A] mb-12">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-[#F7F0EA] rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4D3C2A]">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-[#6B5744] text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;