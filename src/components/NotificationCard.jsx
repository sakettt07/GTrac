import React from 'react';

const NotificationCard = ({ avatar, title, description, time }) => {
  return (
    <div className="flex items-start gap-3 bg-gray-100 p-3 rounded-md shadow-sm">
      {/* Avatar */}
      <img
        src={avatar || 'https://via.placeholder.com/40'}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Text Section */}
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 text-right mt-2">{time}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
