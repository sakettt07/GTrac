import React from 'react';

const MapSection = ({ showRoute }) => {
  return (
    <iframe
      className="w-full h-full min-h-[300px] border-none"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25347.465768665086!2d77.11103561639437!3d28.652750880565247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d030e83cdfc51%3A0xc90ecc4f75417422!2sRamesh%20Nagar!5e1!3m2!1sen!2sin!4v1751876842785!5m2!1sen!2sin"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default MapSection;
