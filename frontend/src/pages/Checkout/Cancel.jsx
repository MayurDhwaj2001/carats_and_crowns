import React from 'react';
import { Link } from 'react-router-dom';

function CheckoutCancel() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your payment was cancelled. Please try again.</p>
        <Link
          to="/cart"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}

export default CheckoutCancel;