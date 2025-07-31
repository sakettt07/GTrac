import { MdWindow, MdOutlineBarChart, MdNotificationImportant } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const Sidebar = ({ isOpen, onSelect }) => {
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const iconSize = 21;

  const items = [
    { label: 'Overview', icon: <MdWindow size={iconSize} />, path: '/dashboard/overview' },
    { label: 'Analytics', icon: <MdOutlineBarChart size={iconSize} />, path: '/dashboard/analytics' },
    { label: 'Profile', icon: <FaUser size={iconSize} />, path: '/dashboard/profile' },
    { label: 'Notification', icon: <MdNotificationImportant size={iconSize} />, path: '/dashboard/notification' },
  ];

  return (
    <div
      className={`fixed top-16 z-40 bg-white shadow-white text-black border-t border-r-gray-400 h-full p-4 space-y-3 flex flex-col items-center transition-transform duration-300
      md:w-20 md:left-0 ${isOpen ? 'left-0 w-64' : 'left-[-100%] md:left-0'}`}
    >
      <button
        className="self-end md:hidden mb-4 text-white"
        onClick={() => onSelect('')}
      >
        <RxCross2 size={24} />
      </button>

      {items.map((item) => (
        <div
          key={item.label}
          className="relative group"
          onMouseEnter={() => item.label === 'Analytics' && setShowAnalyticsModal(true)}
          onMouseLeave={() => item.label === 'Analytics' && setShowAnalyticsModal(false)}
        >
          <Link
            to={item.path}
            className="hover:bg-white hover:text-black w-12 h-12 p-3 rounded-full flex items-center justify-center cursor-pointer"
          >
            {item.icon}
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {item.label}
            </span>
          </Link>

          {/* Analytics Modal */}
          {item.label === 'Analytics' && showAnalyticsModal && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded px-4 py-2 text-sm text-black w-40 z-50">
              <p className="font-semibold mb-1">Analytics Options</p>
              <ul className="space-y-1">
                <li className="hover:text-green-700 cursor-pointer">Traffic</li>
                <li className="hover:text-green-700 cursor-pointer">Sales</li>
                <li className="hover:text-green-700 cursor-pointer">Users</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
