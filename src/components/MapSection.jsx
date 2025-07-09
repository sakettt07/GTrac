import React, { useState } from 'react';
import { FaCog, FaMapMarkerAlt, FaRoad, FaSearchLocation, FaStreetView } from 'react-icons/fa';

const MapSection = ({ showRoute }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {/* Embedded Map */}
      <iframe
        className="w-full h-full border-none"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25347.465768665086!2d77.11103561639437!3d28.652750880565247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d030e83cdfc51%3A0xc90ecc4f75417422!2sRamesh%20Nagar!5e1!3m2!1sen!2sin!4v1751876842785!5m2!1sen!2sin"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Floating Settings Button and Options */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-2">
        {/* Option Buttons (visible when toggled) */}
        {showOptions && (
          <>
            <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition">
              <FaMapMarkerAlt className="text-xl text-gray-800" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition">
              <FaRoad className="text-xl text-gray-800" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition">
              <FaSearchLocation className="text-xl text-gray-800" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition">
              <FaStreetView className="text-xl text-gray-800" />
            </button>
          </>
        )}

        {/* Main Settings Button */}
        <button
          onClick={toggleOptions}
          className="bg-blue-600 p-4 rounded-full text-white shadow-lg hover:bg-blue-700 transition"
        >
          <FaCog className="text-xl animate-spin-slow" />
        </button>
      </div>
    </div>
  );
};

export default MapSection;
