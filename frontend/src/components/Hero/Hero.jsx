import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../../images/female.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function Hero() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Carats and Crowns
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover our exclusive collection of jewelry and accessories
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
          
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={BannerImage}
              alt="Jewelry Banner"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-3xl text-gray-600"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
